import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { Button } from "./ui/button";
import { useState } from "react";
import Image from "next/image";
import { sendEmailOTP, verifySecret } from "@/lib/actions/user-action";
import { useRouter } from "next/navigation";

const OtpDrawer = ({
  accountId,
  email,
}: {
  accountId: string;
  email: string;
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const sessionId = await verifySecret(accountId, password);
      if (sessionId) router.push("/");
    } catch (error) {
      console.log("Failed to verify OTP ", error);;
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    await sendEmailOTP({email});
  };

  return (
    <div>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="rounded-xl md:rounded-t-[30px] px-4 md:px-8 bg-white">
          <DrawerHeader className="relative flex flex-col justify-center">
            <DrawerTitle className="h2 text-center">Enter Your OTP</DrawerTitle>
            <DrawerDescription className="subtitle-2 text-center text-light-100">
              We&apos;ve sent a code to{" "}
              <span className="pl-1 text-brand">{email}</span>
            </DrawerDescription>
          </DrawerHeader>
          <InputOTP
            autoFocus
            maxLength={6}
            value={password}
            onChange={setPassword}
          >
            <InputOTPGroup className="shad-otp">
              <InputOTPSlot index={0} className="shad-otp-slot" />
              <InputOTPSlot index={1} className="shad-otp-slot" />
              <InputOTPSlot index={2} className="shad-otp-slot" />
              <InputOTPSlot index={3} className="shad-otp-slot" />
              <InputOTPSlot index={4} className="shad-otp-slot" />
              <InputOTPSlot index={5} className="shad-otp-slot" />
            </InputOTPGroup>
          </InputOTP>
          <DrawerFooter>
            <div className="flex w-full flex-col gap-4">
              <DrawerClose
                onClick={handleSubmit}
                className="shad-submit-btn h-12 flex justify-center items-center"
                type="button"
              >
                Submit
                {isLoading && (
                  <Image
                    src="/assets/icons/loader.svg"
                    alt="loader"
                    width={24}
                    height={24}
                    className="ml-2 animate-spin"
                  />
                )}
              </DrawerClose>

              <div className="subtitle-2 mt-2 text-center text-light-100">
                Didn&apos;t get a code?
                <Button
                  type="button"
                  variant="link"
                  className="pl-1 text-brand"
                  onClick={handleResendOtp}
                >
                  Click to resend
                </Button>
              </div>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default OtpDrawer;
