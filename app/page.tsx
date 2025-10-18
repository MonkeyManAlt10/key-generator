"use client"

import { useState, useEffect } from "react"

export default function HomePage() {
  const [generatedKey, setGeneratedKey] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)

  useEffect(() => {
    const generated = sessionStorage.getItem('keyGenerated')
    if (generated === 'true') {
      setHasGenerated(true)
      setIsLoading(false)
    } else {
      generateKey()
    }
  }, [])

  const generateKey = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-key", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (response.ok && data.key) {
        setGeneratedKey(data.key)
        setHasGenerated(true)
        sessionStorage.setItem('keyGenerated', 'true')
      } else {
        setError(data.message || "Failed to generate key")
      }
    } catch (err) {
      setError("Network error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    if (generatedKey) {
      try {
        await navigator.clipboard.writeText(generatedKey)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        const textArea = document.createElement("textarea")
        textArea.value = generatedKey
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    }
  }

  if (hasGenerated && !generatedKey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-4">
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md border border-purple-500/30">
          <div className="flex flex-col items-center justify-center gap-6 text-center">
            <div className="text-purple-400 text-5xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-white">Session Expired</h2>
            <p className="text-gray-300">You've already generated your one-time code. Please go through the access link again to generate a new one.</p>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-4">
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md border border-purple-500/30">
          <div className="flex flex-col items-center justify-center gap-6 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
            <h2 className="text-2xl font-bold text-white">Generating Your Code...</h2>
            <p className="text-gray-300">Please wait a moment</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-4">
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md border border-purple-500/30">
          <div className="flex flex-col items-center justify-center gap-6 text-center">
            <div className="text-red-400 text-5xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-white">Error</h2>
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-4">
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md border border-purple-500/30">
        <div className="w-full space-y-6">
          <div className="text-center">
            <div className="text-green-400 text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-white mb-2">Your One-Time Code</h2>
            <p className="text-gray-300 text-sm mb-6">Copy this code and use it immediately</p>

            <div className="bg-purple-950/50 p-6 rounded-xl border-2 border-purple-500/50 backdrop-blur-sm mb-6">
              <code className="text-3xl font-mono text-purple-300 font-bold tracking-widest break-all select-all">
                {generatedKey}
              </code>
            </div>
          </div>

          <button
            onClick={copyToClipboard}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-green-500/50 hover:shadow-green-500/70 hover:scale-105"
          >
            {copied ? "✅ Copied to Clipboard!" : "📋 Copy Code"}
          </button>

          <div className="text-xs text-amber-400 text-center bg-amber-500/10 p-4 rounded-xl border border-amber-500/30 backdrop-blur-sm">
            <span className="font-bold">⚠️ IMPORTANT:</span> This code can only be used once and will expire. Save it now before leaving this page.
          </div>
        </div>
      </div>
    </div>
  )
}