CREATE TYPE public.camera_status AS ENUM ('live','connecting','offline','no-signal','error');
CREATE TYPE public.stream_type AS ENUM ('hls','mjpeg','mp4','webrtc');
CREATE TYPE public.watchlist_status AS ENUM ('WATCH','STOLEN','WANTED','CLEARED');
CREATE TYPE public.alert_severity AS ENUM ('critical','high','medium','low','resolved');

CREATE TABLE public.cameras (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  location text NOT NULL DEFAULT '',
  district text NOT NULL DEFAULT '',
  department text NOT NULL DEFAULT 'POLICE',
  status public.camera_status NOT NULL DEFAULT 'connecting',
  stream_url text,
  stream_type public.stream_type NOT NULL DEFAULT 'hls',
  ai_active boolean NOT NULL DEFAULT false,
  resolution text NOT NULL DEFAULT '1080p',
  map_x numeric NOT NULL DEFAULT 50,
  map_y numeric NOT NULL DEFAULT 50,
  last_heartbeat_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cameras TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cameras TO authenticated;
GRANT ALL ON public.cameras TO service_role;
ALTER TABLE public.cameras ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cameras_public_read" ON public.cameras FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "cameras_auth_insert" ON public.cameras FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "cameras_auth_update" ON public.cameras FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "cameras_auth_delete" ON public.cameras FOR DELETE TO authenticated USING (true);

CREATE TABLE public.detections (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_number text NOT NULL,
  camera_id uuid REFERENCES public.cameras(id) ON DELETE SET NULL,
  camera_code text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  detected_at timestamptz NOT NULL DEFAULT now(),
  confidence numeric NOT NULL DEFAULT 0,
  plate_confidence numeric NOT NULL DEFAULT 0,
  direction text NOT NULL DEFAULT '',
  vehicle_type text NOT NULL DEFAULT '',
  colour text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX detections_vehicle_number_idx ON public.detections (vehicle_number);
GRANT SELECT ON public.detections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.detections TO authenticated;
GRANT ALL ON public.detections TO service_role;
ALTER TABLE public.detections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "detections_public_read" ON public.detections FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "detections_auth_insert" ON public.detections FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "detections_auth_update" ON public.detections FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "detections_auth_delete" ON public.detections FOR DELETE TO authenticated USING (true);

CREATE TABLE public.watchlist (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_number text NOT NULL UNIQUE,
  status public.watchlist_status NOT NULL DEFAULT 'WATCH',
  reason text NOT NULL DEFAULT '',
  added_by text NOT NULL DEFAULT '',
  last_seen_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.watchlist TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.watchlist TO authenticated;
GRANT ALL ON public.watchlist TO service_role;
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "watchlist_public_read" ON public.watchlist FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "watchlist_auth_insert" ON public.watchlist FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "watchlist_auth_update" ON public.watchlist FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "watchlist_auth_delete" ON public.watchlist FOR DELETE TO authenticated USING (true);

CREATE TABLE public.alerts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  severity public.alert_severity NOT NULL DEFAULT 'medium',
  vehicle_number text NOT NULL DEFAULT '',
  camera_id uuid REFERENCES public.cameras(id) ON DELETE SET NULL,
  camera_code text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  note text NOT NULL DEFAULT '',
  confidence numeric NOT NULL DEFAULT 0,
  acknowledged boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.alerts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.alerts TO authenticated;
GRANT ALL ON public.alerts TO service_role;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "alerts_public_read" ON public.alerts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "alerts_auth_insert" ON public.alerts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "alerts_auth_update" ON public.alerts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "alerts_auth_delete" ON public.alerts FOR DELETE TO authenticated USING (true);

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;
CREATE TRIGGER cameras_set_updated_at BEFORE UPDATE ON public.cameras FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();