import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="bookai_db",
    user="postgres",
    password="admin123"
)

cursor = conn.cursor()

print("✅ PostgreSQL Connected Successfully")