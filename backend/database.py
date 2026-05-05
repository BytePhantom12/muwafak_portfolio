import os
from contextlib import contextmanager
import psycopg
from psycopg.rows import dict_row

DATABASE_URL = os.environ.get("DATABASE_URL", "")

def get_connection():
    """Create a new database connection."""
    return psycopg.connect(DATABASE_URL, row_factory=dict_row)

@contextmanager
def get_db():
    """Context manager for database connections."""
    conn = get_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

def execute_query(query: str, params: tuple = None, fetch_one: bool = False, fetch_all: bool = False):
    """Execute a query and optionally fetch results."""
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute(query, params)
            if fetch_one:
                return cur.fetchone()
            if fetch_all:
                return cur.fetchall()
            return None

def execute_returning(query: str, params: tuple = None):
    """Execute a query with RETURNING clause and fetch the result."""
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute(query, params)
            return cur.fetchone()
