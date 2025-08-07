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
  const [isMobile, setIsMobile] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Function to format quote text
  const formatQuoteText = (quote: {text: string; author: string}) => {
    const quoteText = quote.text
    const author = quote.author
    
    if (isMobile && quoteText.length > 50 && !isExpanded) {
      const truncatedText = quoteText.substring(0, 47) + "..."
      return `"${truncatedText}" — ${author}`
    }
    
    return `"${quoteText}" — ${author}`
  }

  // Handle quote tap on mobile
  const handleQuoteTap = () => {
    if (isMobile && currentQuote && currentQuote.text.length > 50) {
      const newExpandedState = !isExpanded
      setIsExpanded(newExpandedState)
      
      // Directly update displayed text without retriggering typing animation
      const newText = newExpandedState 
        ? `"${currentQuote.text}" — ${currentQuote.author}`
        : `"${currentQuote.text.substring(0, 47)}..." — ${currentQuote.author}`
      
      setDisplayedText(newText)
      setIsTyping(false)
    }
  }

  // Initialize with a random quote
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * stoicismQuotes.length)
    setQuoteIndex(randomIndex)
    const selectedQuote = stoicismQuotes[randomIndex]
    setCurrentQuote(selectedQuote)
    setFullText(formatQuoteText(selectedQuote))
    setIsExpanded(false) // Reset expansion state when quote changes
  }, [isMobile])

  // Update full text when expansion state changes
  useEffect(() => {
    if (currentQuote) {
      setFullText(formatQuoteText(currentQuote))
    }
  }, [isExpanded, currentQuote, isMobile])

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
      setIsExpanded(false) // Reset expansion state when quote changes automatically
      setFullText(formatQuoteText(selectedQuote))
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [quoteIndex, currentQuote])

  if (!currentQuote) return null

  return (
    <div className={`flex flex-col items-start gap-2 ${className}`}>
      <div 
        className={`text-vintage-green italic w-full text-left flex items-center justify-start ${
          isMobile && currentQuote.text.length > 50 ? 'cursor-pointer' : ''
        }`}
        onClick={handleQuoteTap}
      >
        <span className="text-xs md:text-sm leading-relaxed">
          {displayedText}
          {isTyping && <span className="animate-pulse">|</span>}
        </span>
      </div>
    </div>
  )
} 