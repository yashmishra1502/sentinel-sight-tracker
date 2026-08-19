import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { queryKeys, sentinelApi } from "@/lib/sentinel/api";
import type { CameraInput, CameraStatus, Department, StreamType } from "@/lib/sentinel/types";

const departments: Department[] = ["POLICE", "MUNICIPAL", "GSRTC", "PANCHAYAT", "HEALTH"];
const statuses: CameraStatus[] = ["live", "connecting", "offline", "no-signal", "error"];
const streamTypes: StreamType[] = ["hls", "mjpeg", "mp4", "webrtc"];

const emptyForm: CameraInput = {
  code: "",
  name: "",
  location: "",
  district: "",
  department: "POLICE",
  status: "connecting",
  streamUrl: "",
  streamType: "hls",
  aiActive: false,
  resolution: "1080p",
  x: 50,
  y: 50,
};

export function AddCameraDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CameraInput>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: CameraInput) => sentinelApi.createCamera(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cameras });
      queryClient.invalidateQueries({ queryKey: queryKeys.kpis });
      setForm(emptyForm);
      setOpen(false);
    },
    onError: (err: unknown) => {
      setError(err instanceof Error ? err.message : "Could not add camera");
    },
  });

  const update = <K extends keyof CameraInput>(key: K, value: CameraInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!form.code.trim() || !form.name.trim() || !form.location.trim() || !form.district.trim()) {
      setError("Camera code, name, location and district are required.");
      return;
    }
    mutation.mutate(form);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setError(null);
          setForm(emptyForm);
        }
      }}
    >
      <DialogTrigger asChild>
        <button className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-md bg-royal px-3 text-sm font-semibold text-royal-foreground transition-colors hover:bg-royal/90">
          <Plus className="size-4" aria-hidden /> Add Camera
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Register a new camera</DialogTitle>
          <DialogDescription>
            Add a real source to the network. It appears on the camera wall, registry and GIS map
            as soon as it&apos;s saved.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Camera code" htmlFor="cam-code">
              <input
                id="cam-code"
                value={form.code}
                onChange={(e) => update("code", e.target.value)}
                placeholder="CAM-052"
                className="input-field"
              />
            </Field>
            <Field label="Display name" htmlFor="cam-name">
              <input
                id="cam-name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="SG Highway Junction"
                className="input-field"
              />
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Location" htmlFor="cam-location">
              <input
                id="cam-location"
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
                placeholder="SG Highway Jn"
                className="input-field"
              />
            </Field>
            <Field label="District" htmlFor="cam-district">
              <input
                id="cam-district"
                value={form.district}
                onChange={(e) => update("district", e.target.value)}
                placeholder="Ahmedabad"
                className="input-field"
              />
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Department" htmlFor="cam-department">
              <select
                id="cam-department"
                value={form.department}
                onChange={(e) => update("department", e.target.value as Department)}
                className="input-field"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Initial status" htmlFor="cam-status">
              <select
                id="cam-status"
                value={form.status}
                onChange={(e) => update("status", e.target.value as CameraStatus)}
                className="input-field"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Stream URL" htmlFor="cam-stream-url">
            <input
              id="cam-stream-url"
              value={form.streamUrl}
              onChange={(e) => update("streamUrl", e.target.value)}
              placeholder="https://…/stream.m3u8 (optional)"
              className="input-field"
            />
          </Field>

          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Stream type" htmlFor="cam-stream-type">
              <select
                id="cam-stream-type"
                value={form.streamType}
                onChange={(e) => update("streamType", e.target.value as StreamType)}
                className="input-field"
              >
                {streamTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Resolution" htmlFor="cam-resolution">
              <input
                id="cam-resolution"
                value={form.resolution}
                onChange={(e) => update("resolution", e.target.value)}
                placeholder="1080p"
                className="input-field"
              />
            </Field>
            <Field label="AI detection" htmlFor="cam-ai">
              <label className="flex h-9 items-center gap-2 text-sm text-foreground">
                <input
                  id="cam-ai"
                  type="checkbox"
                  checked={form.aiActive}
                  onChange={(e) => update("aiActive", e.target.checked)}
                  className="size-4 rounded border-input"
                />
                Active
              </label>
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Map X (0-100)" htmlFor="cam-x">
              <input
                id="cam-x"
                type="number"
                min={0}
                max={100}
                value={form.x}
                onChange={(e) => update("x", Number(e.target.value))}
                className="input-field"
              />
            </Field>
            <Field label="Map Y (0-100)" htmlFor="cam-y">
              <input
                id="cam-y"
                type="number"
                min={0}
                max={100}
                value={form.y}
                onChange={(e) => update("y", Number(e.target.value))}
                className="input-field"
              />
            </Field>
          </div>

          {error ? <p className="text-sm font-semibold text-critical">{error}</p> : null}

          <DialogFooter>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-royal px-5 text-sm font-bold tracking-wide text-royal-foreground uppercase transition-colors hover:bg-royal/90 disabled:opacity-60"
            >
              {mutation.isPending ? "Saving…" : "Save camera"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={htmlFor} className="label-caps block">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
