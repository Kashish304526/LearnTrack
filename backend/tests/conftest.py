import pytest
import uuid
from httpx import AsyncClient, ASGITransport
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from main import app
from database import Base
from dependencies import get_db

# IMPORTANT: import models so tables are registered
import models


# =====================================================
# 1. In-memory SQLite DB shared across connections
# =====================================================
SQLALCHEMY_DATABASE_URL = "sqlite://"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,   # 🔥 THIS FIXES THE ISSUE
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# =====================================================
# 2. Override DB dependency
# =====================================================
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

# =====================================================
# 3. Create tables ONCE per test session
# =====================================================
@pytest.fixture(scope="session", autouse=True)
def create_test_tables():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

# =====================================================
# 4. Async test client
# =====================================================
@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(
        transport=transport,
        base_url="http://test",
        follow_redirects=False,
    ) as client:
        yield client

# =====================================================
# 5. Auth headers fixture
# =====================================================
@pytest.fixture
async def auth_headers(client):
    email = f"user_{uuid.uuid4()}@test.com"
    password = "password123"

    # Register (JSON)
    register_res = await client.post(
        "/auth/register",
        json={
            "email": email,
            "password": password,
        },
    )
    assert register_res.status_code in (200, 201)

    # Login (FORM DATA, username!)
    login_res = await client.post(
        "/auth/login",
        data={
            "username": email,
            "password": password,
        },
    )

    assert login_res.status_code == 200, login_res.text

    token = login_res.json()["access_token"]

    return {
        "Authorization": f"Bearer {token}"
    }

