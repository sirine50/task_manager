from fastapi import FastAPI, HTTPException
import sqlite3
from app.database import get_db_connection
from app.models import UserCreate, TaskCreate, WorkSpaceCreate
from fastapi.middleware.cors import CORSMiddleware
import hashlib 

def hash_password(password: str) -> str: 
    return hashlib.sha256(password.encode()).hexdigest()

app = FastAPI(title="task_manager")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    except HTTPException as e:
        raise e
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

@app.post("/login")
def login(user:UserCreate):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        res = cur.execute("SELECT * FROM users WHERE username = ? AND password = ?", (user.username, hash_password(user.password))).fetchone()
        if res:
            return {"user_id": res["id"], "username": user.username}
        else:
            raise HTTPException(status_code=401, detail="User not found or wrong password")
    except HTTPException as e:
        raise e
    except Exception as e:
        # If there's a bug in your logic, we see it here
        print(f"LOGIC ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        conn.close()


@app.post("/workspaces")
def create_workspace(workspace: WorkSpaceCreate):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("INSERT INTO workspaces (name, owner_id) VALUES (? , ?)", (workspace.name, workspace.owner_id))
        conn.commit()
        return {"id": cursor.lastrowid, "name": workspace.name}
    except sqlite3.Error as e:
        print(f"DATABASE ERROR: {e}") 
        raise HTTPException(status_code=500, detail="Database connection issue")
    except Exception as e:
        print(f"LOGIC ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        conn.close()

@app.get("/workspaces/{user_id}")
def get_workspaces(user_id:int):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        res = cur.execute("SELECT * FROM workspaces WHERE owner_id = ?", (user_id ,))
        return [dict(row) for row in res]
    except sqlite3.Error as e:
        print(f"DATABASE ERROR: {e}") 
        raise HTTPException(status_code=500, detail="Database connection issue")
    except Exception as e:
        print(f"LOGIC ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        conn.close()

@app.post("/tasks")
def add_task(task: TaskCreate):
    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute("INSERT INTO tasks (content, workspace_id) VALUES (?, ?)", (task.content, task.workspace_id))
        conn.commit()
        return {"task_id": cur.lastrowid, "content": task.content, "status": "pending"}
    except sqlite3.Error as e:
        print(f"DATABASE ERROR: {e}") 
        raise HTTPException(status_code=500, detail="Database connection issue")
    except Exception as e:
        print(f"LOGIC ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        conn.close()


@app.get("/workspaces/{workspace_id}/tasks")
def get_tasks(workspace_id: int):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        results = cur.execute("SELECT id, content, status FROM tasks WHERE workspace_id = ?", (workspace_id,))
        return [dict(row) for row in results]
    except sqlite3.Error as e:
        print(f"DATABASE ERROR: {e}") 
        raise HTTPException(status_code=500, detail="Database connection issue")
    except Exception as e:
        print(f"LOGIC ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        conn.close()

@app.put("/tasks/{task_id}")
def update_task(updated_task: TaskCreate, task_id: int):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
        UPDATE tasks
        SET content = ?,
            status = ?
        WHERE id = ?
        """, (updated_task.content, updated_task.status, task_id))
        conn.commit()
        return {"message": "task updated"}
    except sqlite3.Error as e:
        print(f"DATABASE ERROR: {e}") 
        raise HTTPException(status_code=500, detail="Database connection issue")
    except Exception as e:
        print(f"LOGIC ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        conn.close()

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute('DELETE FROM tasks WHERE id = ?', (task_id ,))
        conn.commit()
        return {"message": "task deleted"}
    except sqlite3.Error as e:
        print(f"DATABASE ERROR: {e}") 
        raise HTTPException(status_code=500, detail="Database connection issue")
    except Exception as e:
        print(f"LOGIC ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        conn.close()

@app.delete("/workspaces/{workspace_id}")
def delete_workspace(workspace_id: int):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        # Since you have ON DELETE CASCADE, this one line kills the workspace AND its tasks
        cur.execute("DELETE FROM workspaces WHERE id = ?", (workspace_id,))
        conn.commit()
        return {'message': "workspace deleted"}
    except sqlite3.Error as e:
        print(f"DATABASE ERROR: {e}") 
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        conn.close()

@app.delete("/users/{user_id}")
def delete_user(user_id: int):
    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute("DELETE FROM users WHERE id = ?", (user_id ,))
        conn.commit()
        return {'message': "user deleted"}
    except sqlite3.Error as e:
        print(f"DATABASE ERROR: {e}") 
        raise HTTPException(status_code=500, detail="Database connection issue")
    except Exception as e:
        print(f"LOGIC ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        conn.close()