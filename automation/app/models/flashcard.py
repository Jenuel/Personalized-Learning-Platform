from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, func
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Flashcard(Base):
    __tablename__ = "flashcards"

    cardId = Column(Integer, primary_key=True, index=True)
    question = Column(String, nullable=False)
    answer = Column(String, nullable=False)

    metadata = relationship("CardMetadata", back_populates="card", uselist=False, cascade="all, delete", passive_deletes=True)


class CardMetadata(Base):
    __tablename__ = "card_metadata"

    cardId = Column(Integer, ForeignKey("flashcards.cardId", ondelete="CASCADE"), primary_key=True)
    interval = Column(Integer, default=0)
    next_review = Column(Date, default=func.current_date())
    ease_factor = Column(Float, default=2.5)

    card = relationship("Flashcard", back_populates="metadata", uselist=False)
