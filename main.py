import mysql.connector
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db_password():
    """Read password from Docker secret file or fall back to env variable."""
    secret_file = os.getenv("MYSQL_ROOT_PASSWORD_FILE")
    if secret_file and os.path.exists(secret_file):
        with open(secret_file) as f:
            return f.read().strip()
    return os.getenv("MYSQL_ROOT_PASSWORD")


def get_db_connection():
    return mysql.connector.connect(
        database=os.getenv("MYSQL_DATABASE"),
        user=os.getenv("MYSQL_USER"),
        password=get_db_password(),
        port=3306,
        host=os.getenv("MYSQL_HOST"),
    )


class UserCreate(BaseModel):
    firstName: str
    lastName: str
    email: str
    birthDate: str
    postalCode: str
    city: str


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/users")
async def get_users():
    conn = get_db_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM utilisateur")
        records = cursor.fetchall()
        users = []
        for r in records:
            users.append({
                "id": r["id"],
                "firstName": r.get("prenom") or "",
                "lastName": r.get("nom") or "",
                "email": r["email"],
                "birthDate": str(r["date_naissance"]) if r.get("date_naissance") else None,
                "postalCode": r.get("code_postal"),
                "city": r.get("ville"),
            })
        return {"utilisateurs": users}
    finally:
        conn.close()


@app.post("/users", status_code=201)
async def create_user(user: UserCreate):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO utilisateur (nom, prenom, email, date_naissance, code_postal, ville)
               VALUES (%s, %s, %s, %s, %s, %s)""",
            (user.lastName, user.firstName, user.email,
             user.birthDate, user.postalCode, user.city),
        )
        conn.commit()
        return {
            "id": cursor.lastrowid,
            "firstName": user.firstName,
            "lastName": user.lastName,
            "email": user.email,
            "birthDate": user.birthDate,
            "postalCode": user.postalCode,
            "city": user.city,
        }
    except mysql.connector.IntegrityError:
        raise HTTPException(
            status_code=400,
            detail={"message": "L'email existe déjà. Veuillez en utiliser un autre."},
        )
    finally:
        conn.close()
