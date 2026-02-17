import { toast as sonnerToast } from "sonner"

type ToastProps = {
    title?: React.ReactNode
    description?: React.ReactNode
    variant?: "default" | "destructive" | "success"
    action?: React.ReactNode
    [key: string]: any
}

function toast({ title, description, variant, ...props }: ToastProps) {
    if (variant === "destructive") {
        return sonnerToast.error(title, {
            description,
            ...props,
        })
    }
    if (variant === "success") {
        return sonnerToast.success(title, {
            description,
            ...props,
        })
    }
    return sonnerToast(title, {
        description,
        ...props,
    })
}

function useToast() {
    return {
        toast,
        dismiss: (id?: string | number) => sonnerToast.dismiss(id),
    }
}

export { useToast, toast }
