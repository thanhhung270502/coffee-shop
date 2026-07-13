"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { toast } from "sonner";

import { Button, Input } from "@/shared/components";

export const CustomerFooterNewsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    toast.info("Newsletter subscription coming soon.");
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
      <Input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Enter your email address"
        aria-label="Email address for newsletter"
        size="sm"
        className="flex-1"
      />
      <Button type="submit" variant="primary" size="sm">
        Subscribe
      </Button>
    </form>
  );
};
