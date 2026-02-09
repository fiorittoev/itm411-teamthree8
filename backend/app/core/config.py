from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    SUPABASE_SERVICE_ROLE_KEY: str
    SECRET_KEY: str
    DEBUG: bool = False
    PORT: int = 8000

    class Config:
        env_file = ".env"


settings = Settings()
