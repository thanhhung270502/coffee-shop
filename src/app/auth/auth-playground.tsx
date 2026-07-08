"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

type PublicUser = {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
};

type AuthResponse = {
  status: number;
  data: unknown;
};

async function authFetch(path: string, init?: RequestInit): Promise<AuthResponse> {
  const res = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, data };
}

const inputClassName =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50";

const buttonClassName =
  "rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300";

const secondaryButtonClassName =
  "rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800";

export function AuthPlayground() {
  const [sessionUser, setSessionUser] = useState<PublicUser | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [lastResponse, setLastResponse] = useState<AuthResponse | null>(null);

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerName, setRegisterName] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const refreshSession = useCallback(async ({ recordResponse = false } = {}) => {
    setSessionLoading(true);
    const result = await authFetch("/api/auth/me");

    if (recordResponse) {
      setLastResponse(result);
    }

    if (result.status === 200 && result.data && typeof result.data === "object" && "user" in result.data) {
      setSessionUser((result.data as { user: PublicUser }).user);
    } else {
      setSessionUser(null);
    }

    setSessionLoading(false);
  }, []);

  useEffect(() => {
    void refreshSession({ recordResponse: true });
  }, [refreshSession]);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);

    const result = await authFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: registerEmail,
        password: registerPassword,
        ...(registerName.trim() ? { name: registerName.trim() } : {}),
      }),
    });

    setLastResponse(result);

    if (result.status === 201) {
      setRegisterPassword("");
      await refreshSession();
    }

    setBusy(false);
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);

    const result = await authFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword,
      }),
    });

    setLastResponse(result);

    if (result.status === 200) {
      setLoginPassword("");
      await refreshSession();
    }

    setBusy(false);
  }

  async function handleLogout() {
    setBusy(true);
    const result = await authFetch("/api/auth/logout", { method: "POST" });
    setLastResponse(result);
    setSessionUser(null);
    setSessionLoading(false);
    setBusy(false);
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-10">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Auth API playground
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Exercise register, login, logout, and me against the session cookie routes.
        </p>
      </header>

      <section className="space-y-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Session</h2>
          <button
            type="button"
            className={secondaryButtonClassName}
            onClick={() => void refreshSession({ recordResponse: true })}
            disabled={busy || sessionLoading}
          >
            Refresh
          </button>
        </div>
        {sessionLoading ? (
          <p className="text-sm text-zinc-500">Checking session…</p>
        ) : sessionUser ? (
          <div className="space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
            <p>
              Signed in as <span className="font-medium">{sessionUser.email}</span>
              {sessionUser.name ? ` (${sessionUser.name})` : ""}
            </p>
            <p className="font-mono text-xs text-zinc-500">{sessionUser.id}</p>
          </div>
        ) : (
          <p className="text-sm text-zinc-500">Not signed in</p>
        )}
        <button
          type="button"
          className={secondaryButtonClassName}
          onClick={() => void handleLogout()}
          disabled={busy || !sessionUser}
        >
          Logout
        </button>
      </section>

      <section className="space-y-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Register</h2>
        <form className="space-y-3" onSubmit={handleRegister}>
          <label className="block space-y-1 text-sm">
            <span className="text-zinc-700 dark:text-zinc-300">Email</span>
            <input
              className={inputClassName}
              type="email"
              required
              autoComplete="email"
              value={registerEmail}
              onChange={(event) => setRegisterEmail(event.target.value)}
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="text-zinc-700 dark:text-zinc-300">Password</span>
            <input
              className={inputClassName}
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={registerPassword}
              onChange={(event) => setRegisterPassword(event.target.value)}
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="text-zinc-700 dark:text-zinc-300">Name (optional)</span>
            <input
              className={inputClassName}
              type="text"
              autoComplete="name"
              value={registerName}
              onChange={(event) => setRegisterName(event.target.value)}
            />
          </label>
          <button type="submit" className={buttonClassName} disabled={busy}>
            Register
          </button>
        </form>
      </section>

      <section className="space-y-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Login</h2>
        <form className="space-y-3" onSubmit={handleLogin}>
          <label className="block space-y-1 text-sm">
            <span className="text-zinc-700 dark:text-zinc-300">Email</span>
            <input
              className={inputClassName}
              type="email"
              required
              autoComplete="email"
              value={loginEmail}
              onChange={(event) => setLoginEmail(event.target.value)}
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="text-zinc-700 dark:text-zinc-300">Password</span>
            <input
              className={inputClassName}
              type="password"
              required
              autoComplete="current-password"
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value)}
            />
          </label>
          <button type="submit" className={buttonClassName} disabled={busy}>
            Login
          </button>
        </form>
      </section>

      <section className="space-y-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Last response</h2>
        {lastResponse ? (
          <div className="space-y-2">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Status: <span className="font-mono font-medium">{lastResponse.status}</span>
            </p>
            <pre className="overflow-x-auto rounded-md bg-zinc-100 p-3 text-xs text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
              {JSON.stringify(lastResponse.data, null, 2)}
            </pre>
          </div>
        ) : (
          <p className="text-sm text-zinc-500">No requests yet</p>
        )}
      </section>
    </div>
  );
}
