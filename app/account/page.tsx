"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Profile = {
  name: string;
  email: string;
  phone: string;
};

export default function AccountPage() {
  const { toast } = useToast();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  // password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  // ✅ Fetch profile on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setProfile(data.user);
        } else {
          console.error("Failed to fetch profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  // ✅ Handle profile save
  const handleSave = async () => {
    if (!profile) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({ title: "❌ Not logged in" });
        return;
      }

      const res = await fetch("/api/auth/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      const data = await res.json();
      if (res.ok) {
        toast({
          title: "✅ Profile updated",
          description: "Your profile has been saved.",
        });
        setProfile(data.user);
      } else {
        toast({
          title: "❌ Error",
          description: data.error || "Failed to update profile",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({ title: "❌ Error", description: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle password change
  const handleChangePassword = async () => {
    if (!newPassword || !currentPassword || !confirmPassword) {
      toast({
        title: "⚠️ Missing fields",
        description: "Please fill out all fields.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "⚠️ Password mismatch",
        description: "New passwords do not match.",
      });
      return;
    }

    setPwLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({ title: "❌ Not logged in" });
        return;
      }

      const res = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: currentPassword,
          newPassword: newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast({
          title: "✅ Password updated",
          description: "Your password has been changed.",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast({
          title: "❌ Error",
          description: data.error || "Failed to change password",
        });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast({ title: "❌ Error", description: "Something went wrong" });
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">My Account</h1>
          <p className="text-muted-foreground">
            Manage your account settings and view purchases
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="purchases">Purchases</TabsTrigger>
          </TabsList>

          {/* ✅ Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your account information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-10 w-10" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {profile?.name || "Loading..."}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {profile?.email || ""}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {profile?.phone || ""}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* ✅ Controlled fields */}
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={profile?.name || ""}
                      onChange={(e) =>
                        setProfile((prev) =>
                          prev ? { ...prev, name: e.target.value } : null
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={profile?.email || ""}
                      onChange={(e) =>
                        setProfile((prev) =>
                          prev ? { ...prev, email: e.target.value } : null
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profile?.phone || ""}
                      onChange={(e) =>
                        setProfile((prev) =>
                          prev ? { ...prev, phone: e.target.value } : null
                        )
                      }
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>

            {/* ✅ Password Section */}
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Update your password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    autoComplete="new-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleChangePassword} disabled={pwLoading}>
                  {pwLoading ? "Updating..." : "Update Password"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Purchases Section (unchanged) */}
          <TabsContent value="purchases" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>My Courses</CardTitle>
                  <CardDescription>
                    Access your purchased courses
                  </CardDescription>
                </div>
                <ShoppingBag className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  (Purchased courses will appear here)
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
