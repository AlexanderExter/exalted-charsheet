export default function SiteFooter() {
  return (
    <footer className="border-t bg-background mt-8">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Exalted Community. All rights reserved.</p>
      </div>
    </footer>
  )
}
