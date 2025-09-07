"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { sampleOrders } from "@/lib/data";
import { ShoppingBag, Download, ExternalLink } from "lucide-react";

export default function OrdersPage() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Order History</h1>
          <p className="text-muted-foreground">
            View your past orders and download invoices
          </p>
        </div>

        <div className="space-y-6">
          {sampleOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <CardTitle>Order #{order.id}</CardTitle>
                    <CardDescription>Placed on {order.date}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        order.status === "completed" ? "default" : "outline"
                      }
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Invoice
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.courses.map((course) => (
                    <div
                      key={course.id}
                      className="flex flex-col sm:flex-row justify-between gap-4 p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
                          <ShoppingBag className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-medium">{course?.title}</p>
                          <p className="text-sm text-muted-foreground">
                            By {course.instructor.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          ${course.discountedPrice || course.price}
                        </span>
                        <Button asChild size="sm">
                          <Link href={`/courses/${course.id}`}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Course
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Separator />

                  <div className="flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-medium">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Button asChild variant="outline">
            <Link href="/account">Back to Account</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
