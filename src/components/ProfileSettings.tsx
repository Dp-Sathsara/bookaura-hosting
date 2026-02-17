import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  User, Camera, Lock, Save,
  Mail, MapPin, Phone, Loader2
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { UserService, AuthService } from "@/services/api";
import { toast } from "sonner";
import { uploadToCloudinary } from "@/utils/cloudinary";

const profileSchema = z.object({
  username: z.string().min(1, "Name is required"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits").optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  imageUrl: z.string().optional().or(z.literal('')),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

const ProfileSettings = () => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  const imageUrl = watch("imageUrl");

  const {
    register: registerPass,
    handleSubmit: handleSubmitPass,
    reset: resetPass,
    formState: { errors: errorsPass }
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user?.id) return;
      try {
        const data = await UserService.getById(user.id);
        reset({
          username: data.username,
          phoneNumber: (data as any).phoneNumber || "",
          address: (data as any).address || "",
          imageUrl: data.imageUrl || "",
        });
      } catch (error) {
        toast.error("Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [user?.id, reset]);

  const onUpdateProfile = async (data: ProfileFormValues) => {
    if (!user?.id) return;
    setIsUpdating(true);
    try {
      const updatedUser = await UserService.updateProfile(user.id, data);
      // Update local context as well
      login({ ...user, ...updatedUser });
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const onChangePassword = async (data: PasswordFormValues) => {
    if (!user?.id) return;
    setIsChangingPassword(true);
    try {
      await AuthService.changePassword({
        userId: user.id,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password changed successfully!");
      setIsPasswordModalOpen(false);
      resetPass();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const url = await uploadToCloudinary(file);
      setValue("imageUrl", url, { shouldDirty: true });
      toast.success("Image uploaded successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 font-sans animate-in fade-in duration-500">
      <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-8">Profile Settings</h1>

      <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-background">
        <CardContent className="p-8 md:p-12 space-y-10">
          <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-10">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-muted shadow-xl bg-muted flex items-center justify-center">
                  {isUploadingImage ? (
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  ) : imageUrl ? (
                    <img src={imageUrl} className="h-full w-full object-cover" alt="Profile" />
                  ) : (
                    <User className="h-16 w-16 text-muted-foreground/40" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                  className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform disabled:opacity-50"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2"><User className="h-3 w-3" /> Full Name</Label>
                <Input {...register("username")} className="h-12 rounded-2xl bg-muted/30 border-none font-bold placeholder:opacity-50" />
                {errors.username && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.username.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2"><Mail className="h-3 w-3" /> Email</Label>
                <Input value={user?.email} disabled className="h-12 rounded-2xl bg-muted/10 border-none font-bold opacity-60 italic" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2"><Phone className="h-3 w-3" /> Phone</Label>
                <Input {...register("phoneNumber")} placeholder="Enter phone number" className="h-12 rounded-2xl bg-muted/30 border-none font-bold placeholder:opacity-50" />
                {errors.phoneNumber && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.phoneNumber.message}</p>}
              </div>
              <div className="flex items-end">
                <Button type="button" variant="outline" onClick={() => { setIsPasswordModalOpen(true); resetPass(); }} className="h-12 w-full rounded-2xl border-2 border-primary/20 font-black uppercase text-[10px] tracking-widest gap-2">
                  <Lock className="h-4 w-4" /> Change Password
                </Button>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2"><MapPin className="h-3 w-3" /> Shipping Address</Label>
                <Input {...register("address")} placeholder="Enter your full address" className="h-12 rounded-2xl bg-muted/30 border-none font-bold placeholder:opacity-50" />
                {errors.address && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.address.message}</p>}
              </div>
            </div>

            <Button type="submit" disabled={isUpdating} className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all duration-500 ${isUpdating ? "bg-green-500 text-white" : "bg-primary text-white"}`}>
              {isUpdating ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving...</> : <><Save className="mr-2 h-5 w-5" /> Save Profile</>}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] font-sans border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-center">Change Password</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmitPass(onChangePassword)} className="py-6 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Current Password</Label>
              <Input type="password" {...registerPass("currentPassword")} placeholder="••••••••" className="h-11 rounded-xl bg-muted/30 border-none font-bold" />
              {errorsPass.currentPassword && <p className="text-red-500 text-[10px] font-bold ml-1">{errorsPass.currentPassword.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest ml-1">New Password</Label>
              <Input type="password" {...registerPass("newPassword")} placeholder="••••••••" className="h-11 rounded-xl bg-muted/30 border-none font-bold" />
              {errorsPass.newPassword && <p className="text-red-500 text-[10px] font-bold ml-1">{errorsPass.newPassword.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Confirm New Password</Label>
              <Input type="password" {...registerPass("confirmPassword")} placeholder="••••••••" className="h-11 rounded-xl bg-muted/30 border-none font-bold" />
              {errorsPass.confirmPassword && <p className="text-red-500 text-[10px] font-bold ml-1">{errorsPass.confirmPassword.message}</p>}
            </div>
            <Button type="submit" disabled={isChangingPassword} className="w-full h-14 rounded-2xl font-black uppercase tracking-widest bg-primary text-white mt-4 shadow-lg shadow-primary/20">
              {isChangingPassword ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
              Update Password
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileSettings;