"use client"
import { useState, useEffect } from "react"

import { stoicismQuotes } from "@/data/quotes"

interface AnimatedQuoteProps {
  className?: string
}

export function AnimatedQuote({ className = "" }: AnimatedQuoteProps) {
  const [currentQuote, setCurrentQuote] = useState<{text: string; author: string} | null>(null)
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [fullText, setFullText] = useState("")

  // Initialize with a random quote
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * stoicismQuotes.length)
    setQuoteIndex(randomIndex)
    const selectedQuote = stoicismQuotes[randomIndex]
    setCurrentQuote(selectedQuote)
    setFullText(`"${selectedQuote.text}" — ${selectedQuote.author}`)
  }, [])

  // Typing animation effect
  useEffect(() => {
    if (!fullText) return

    setIsTyping(true)
    setDisplayedText("")

    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex))
        currentIndex++
      } else {
        setIsTyping(false)
        clearInterval(typingInterval)
      }
    }, 50) // Adjust speed of typing here (lower = faster)

    return () => clearInterval(typingInterval)
  }, [fullText])

  // Change quote every 30 seconds
  useEffect(() => {
    if (!currentQuote) return

    const interval = setInterval(() => {
      const newIndex = (quoteIndex + 1) % stoicismQuotes.length
      setQuoteIndex(newIndex)
      const selectedQuote = stoicismQuotes[newIndex]
      setCurrentQuote(selectedQuote)
      setFullText(`"${selectedQuote.text}" — ${selectedQuote.author}`)
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [quoteIndex, currentQuote])

  if (!currentQuote) return null

  return (
    <div className={`flex flex-col items-end gap-2 ${className}`}>
      <div className="text-vintage-green italic max-w-md text-right">
        <span className="text-sm sm:text-base leading-relaxed">
          {displayedText}
          {isTyping && <span className="animate-pulse">|</span>}
        </span>
      </div>
    </div>
  )
} 