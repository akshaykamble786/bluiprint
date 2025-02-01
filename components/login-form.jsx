'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useGoogleLogin } from "@react-oauth/google"
import { UserDetailsContext } from "@/context/user-details-context"
import { useContext } from "react"
import axios from "axios"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import uuid4 from "uuid4"

export function LoginForm({ className, openDialog, closeDialog, ...props }) {
  const { userDetails, setUserDetails } = useContext(UserDetailsContext);
  const CreateUser = useMutation(api.users.createUser);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      const userInfo = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${tokenResponse?.access_token}`,
        },
      }
      );
      const user = userInfo?.data;
      setUserDetails(userInfo?.data);
      try {
        await CreateUser({
          name: user?.name,
          email: user?.email,
          picture: user?.picture,
          uid: uuid4()
        })
      } catch (error) {
        console.error("Error calling CreateUser mutation:", error);
      }

      if (typeof window !== undefined) {
        localStorage.setItem('user', JSON.stringify(user));
      }

      closeDialog(false);
    },
    onError: errorResponse => console.log(errorResponse),
  });
  return (
    (
      <div>
            <Dialog open={openDialog} onOpenChange={closeDialog}>
                <DialogContent>
                    <DialogHeader className="flex flex-col items-center justify-center gap-3">
                        <DialogTitle className='font-bold text-2xl text-center text-white'>
                            Welcome to Bluiprint
                        </DialogTitle>
                        <DialogDescription className="mt-2 text-center text-lg justify-center flex flex-col" >
                            <Button onClick={googleLogin} className="bg-blue-500 text-white hover:bg-blue-300 mt-3 mx-auto">Sign In with Google</Button>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className='text-center mt-3'>
                        <p className='text-white text-sm'>By signing in you agree to our <a href="#" className='text-blue-500'>Terms of Service</a> and <a href="#" className='text-blue-500'>Privacy Policy</a></p>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
  );
}