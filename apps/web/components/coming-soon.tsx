import Link from "next/link"
import { ArrowLeft, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface ComingSoonProps {
    title?: string
    description?: string
}

export function ComingSoon({
    title = "Coming Soon",
    description = "We are working hard to bring you this feature. Stay tuned!"
}: ComingSoonProps) {
    return (
        <div className="flex items-center justify-center min-h-[60vh] p-4">
            <Card className="w-full max-w-md border-none shadow-lg bg-card/50 backdrop-blur-sm text-center">
                <CardHeader className="space-y-4 pb-2">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                        <Rocket className="size-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        {description}
                    </p>
                </CardContent>
                <CardFooter className="justify-center pt-2">
                    <Button variant="outline" asChild className="gap-2">
                        <Link href="/dashboard">
                            <ArrowLeft className="size-4" />
                            Back to Dashboard
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
