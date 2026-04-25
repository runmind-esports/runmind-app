export interface StravaActivity {
  id: number
  name: string
  type: string // 'Run', 'Walk', 'Ride', etc.
  sport_type: string
  start_date: string // ISO 8601
  start_date_local: string
  distance: number // meters
  moving_time: number // seconds
  elapsed_time: number // seconds
  total_elevation_gain: number // meters
  average_speed: number // m/s
  max_speed: number // m/s
  average_heartrate?: number
  max_heartrate?: number
  average_cadence?: number
  has_heartrate: boolean
  suffer_score?: number
  map?: {
    summary_polyline: string
  }
}

export interface StravaAthleteProfile {
  id: number
  firstname: string
  lastname: string
  profile_medium: string // 62x62 avatar URL
  profile: string // 124x124 avatar URL
  city?: string
  country?: string
}

export interface StravaAthleteStats {
  recent_run_totals: StravaTotals
  all_run_totals: StravaTotals
  ytd_run_totals: StravaTotals
  recent_ride_totals: StravaTotals
  all_ride_totals: StravaTotals
}

export interface StravaTotals {
  count: number
  distance: number // meters
  moving_time: number // seconds
  elapsed_time: number
  elevation_gain: number
  achievement_count?: number
}

export interface StravaLap {
  id: number
  name: string
  distance: number
  moving_time: number
  elapsed_time: number
  start_index: number
  end_index: number
  average_speed: number
  max_speed: number
  average_heartrate?: number
  max_heartrate?: number
  lap_index: number
  pace_zone?: number
}

export interface StravaZone {
  distribution_buckets: Array<{
    min: number
    max: number
    time: number
  }>
  type: string // 'heartrate', 'power'
  sensor_based: boolean
}

export interface StravaActivityDetail extends StravaActivity {
  description?: string
  calories: number
  splits_metric?: StravaSplit[]
  laps?: StravaLap[]
  segment_efforts?: unknown[]
  best_efforts?: unknown[]
}

export interface StravaSplit {
  distance: number
  elapsed_time: number
  moving_time: number
  average_speed: number
  average_heartrate?: number
  pace_zone: number
  split: number
  elevation_difference: number
}

export interface PaginatedActivitiesParams {
  page?: number
  perPage?: number
  before?: number // epoch seconds
  after?: number // epoch seconds
}
