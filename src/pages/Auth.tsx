import { useState, useRef } from 'react'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const captchaRef = useRef<HCaptcha>(null)
  const { signUp, signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!captchaToken) {
      toast({
        title: "Vérification requise",
        description: "Veuillez compléter le captcha.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const { error } = isSignUp
        ? await signUp(email, password, captchaToken)
        : await signIn(email, password, captchaToken)

      if (error) {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        })
        // Reset captcha on error so user can retry
        captchaRef.current?.resetCaptcha()
        setCaptchaToken(null)
      } else if (isSignUp) {
        toast({
          title: "Compte créé !",
          description: "Vérifiez votre email pour confirmer votre compte.",
        })
      }
    } catch {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      })
      captchaRef.current?.resetCaptcha()
      setCaptchaToken(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="text-6xl animate-bounce">🧙‍♂️</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            RPG Hybride
          </h1>
          <p className="text-muted-foreground">
            Ton premier pas vers l'athlète hybride, version RPG.
          </p>
        </div>

        {/* Auth Form */}
        <Card className="border-accent/20 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle>{isSignUp ? 'Créer un compte' : 'Se connecter'}</CardTitle>
            <CardDescription>
              {isSignUp 
                ? 'Commence ton aventure RPG fitness' 
                : 'Reprends ton aventure là où tu l\'as laissée'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kevin@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
              <div className="flex justify-center">
                <HCaptcha
                  ref={captchaRef}
                  sitekey={import.meta.env.VITE_HCAPTCHA_SITE_KEY}
                  onVerify={(token) => setCaptchaToken(token)}
                  onExpire={() => setCaptchaToken(null)}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading || !captchaToken}
              >
                {loading ? 'Chargement...' : (isSignUp ? 'Créer mon compte' : 'Se connecter')}
              </Button>
            </form>
            
            <div className="mt-4 text-center">
              <Button 
                variant="ghost" 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm"
              >
                {isSignUp 
                  ? 'Déjà un compte ? Se connecter' 
                  : 'Pas de compte ? Créer un compte'
                }
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="text-2xl">⚔️</div>
            <p className="text-xs text-muted-foreground">Quêtes épiques</p>
          </div>
          <div className="space-y-2">
            <div className="text-2xl">📊</div>
            <p className="text-xs text-muted-foreground">Stats progression</p>
          </div>
          <div className="space-y-2">
            <div className="text-2xl">🏆</div>
            <p className="text-xs text-muted-foreground">Badges collectés</p>
          </div>
        </div>
      </div>
    </div>
  )
}