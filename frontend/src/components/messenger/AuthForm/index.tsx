import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface AuthFormProps {
  showSignUp: boolean;
  setShowSignUp: (show: boolean) => void;
  setIsLoggedIn: (logged: boolean) => void;
}

const AuthForm = ({ showSignUp, setShowSignUp, setIsLoggedIn }: AuthFormProps) => (
  <Card className="w-full max-w-md p-6 space-y-4">
    <h2 className="text-2xl font-bold text-center">
      {showSignUp ? 'Create Account' : 'Sign In'}
    </h2>
    {showSignUp && (
      <Input placeholder="Full Name" type="text" className="w-full" />
    )}
    <Input placeholder="Email" type="email" className="w-full" />
    <Input placeholder="Password" type="password" className="w-full" />
    {showSignUp && (
      <Input placeholder="Confirm Password" type="password" className="w-full" />
    )}
    <Button className="w-full" onClick={() => setIsLoggedIn(true)}>
      {showSignUp ? 'Sign Up' : 'Sign In'}
    </Button>
    <p className="text-center text-sm">
      {showSignUp ? 'Already have an account?' : "Don't have an account?"}
      <span 
        className="text-blue-500 cursor-pointer ml-1"
        onClick={() => setShowSignUp(!showSignUp)}
      >
        {showSignUp ? 'Sign In' : 'Sign Up'}
      </span>
    </p>
  </Card>
);

export default AuthForm;