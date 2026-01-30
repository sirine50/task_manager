from fastapi import FastAPI, HTTPException
import sqlite3
from app.database import get_db_connection
from app.models import UserCreate, TaskCreate, WorkSpaceCreate
import hashlib 

def hash_password(password: str) -> str: 
    return hashlib.sha256(password.encode()).hexdigest()

app = FastAPI(title="task_manager")

@app.post("/register")

def register(user: UserCreate):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        exist = cursor.execute("SELECT * FROM users WHERE username = ?", (user.username,)).fetchone()
        if not exist:
            cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (user.username, hash_password(user.password)))
            conn.commit()
            return {"user_id": cursor.lastrowid, "username": user.username}
        raise HTTPException(status_code=400, detail="Username already exist")
    except sqlite3.Error as e:
        # If the DB crashes, we see the REAL error in the terminal
        print(f"DATABASE ERROR: {e}") 
        raise HTTPException(status_code=500, detail="Database connection issue")
    except Exception as e:
        # If there's a bug in your logic, we see it here
        print(f"LOGIC ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        conn.close()

@app.post("/workspaces/")

def create_workspace(workspace: WorkSpaceCreate):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("INSERT INTO workspaces (name, owner_id) VALUES (? , ?)", (workspace.name, workspace.owner_id))
        conn.commit()
        return {"workspace_id": cursor.lastrowid, "name": workspace.name}
    except sqlite3.Error as e:
        print(f"DATABASE ERROR: {e}") 
        raise HTTPException(status_code=500, detail="Database connection issue")
    except Exception as e:
        print(f"LOGIC ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        conn.close()
       