/**
 * Form state shapes for the admin panel.
 *
 * These live outside the `actions/*` modules because a file marked `"use server"`
 * may only export async functions — exporting a plain object from one is a build
 * error, not a warning.
 */

export interface AdminActionState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
}

export const ADMIN_IDLE: AdminActionState = { status: "idle" };

export interface AuthState {
  status: "idle" | "error" | "magic_link_sent";
  message?: string;
}

export const AUTH_IDLE: AuthState = { status: "idle" };

export interface SettingsState {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
}

export const SETTINGS_IDLE: SettingsState = { status: "idle" };
