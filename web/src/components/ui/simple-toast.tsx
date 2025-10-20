"use client"

import React, { useState, useEffect } from 'react'
import { X, CheckCircle, AlertCircle } from 'lucide-react'

interface ToastProps {
    id: string
    title: string
    description?: string
    variant?: 'default' | 'destructive' | 'success'
    onClose: (id: string) => void
}

export function SimpleToast({ id, title, description, variant = 'default', onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
            setTimeout(() => onClose(id), 300)
        }, 5000)

        return () => clearTimeout(timer)
    }, [id, onClose])

    const getVariantStyles = () => {
        switch (variant) {
            case 'success':
                return 'bg-green-50 border-green-200 text-green-800'
            case 'destructive':
                return 'bg-red-50 border-red-200 text-red-800'
            default:
                return 'bg-background border-border text-foreground'
        }
    }

    const getIcon = () => {
        switch (variant) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-600" />
            case 'destructive':
                return <AlertCircle className="h-5 w-5 text-red-600" />
            default:
                return null
        }
    }

    if (!isVisible) return null

    return (
        <div className={`fixed top-4 right-4 z-50 max-w-sm w-full p-4 rounded-lg border shadow-lg transition-all duration-300 ${getVariantStyles()}`}>
            <div className="flex items-start space-x-3">
                {getIcon()}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{title}</p>
                    {description && (
                        <p className="text-sm opacity-90 mt-1">{description}</p>
                    )}
                </div>
                <button
                    onClick={() => {
                        setIsVisible(false)
                        setTimeout(() => onClose(id), 300)
                    }}
                    className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}

interface ToastContextType {
    toasts: ToastProps[]
    addToast: (toast: Omit<ToastProps, 'id' | 'onClose'>) => void
    removeToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastProps[]>([])

    const addToast = (toast: Omit<ToastProps, 'id' | 'onClose'>) => {
        const id = Math.random().toString(36).substr(2, 9)
        const newToast = { ...toast, id, onClose: removeToast }
        setToasts(prev => [...prev, newToast])
    }

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
    }

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {toasts.map(toast => (
                    <SimpleToast key={toast.id} {...toast} />
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useSimpleToast() {
    const context = React.useContext(ToastContext)
    if (!context) {
        throw new Error('useSimpleToast must be used within a ToastProvider')
    }
    return context
}
