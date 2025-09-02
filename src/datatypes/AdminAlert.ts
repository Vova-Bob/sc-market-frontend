export interface AdminAlert {
  alert_id: string
  title: string
  content: string
  link?: string | null
  target_type:
    | "all_users"
    | "org_members"
    | "org_owners"
    | "admins_only"
    | "specific_org"
  target_spectrum_id?: string | null
  created_by: string
  created_at: string
  active: boolean
}

export interface AdminAlertCreate {
  title: string
  content: string
  link?: string | null
  target_type:
    | "all_users"
    | "org_members"
    | "org_owners"
    | "admins_only"
    | "specific_org"
  target_spectrum_id?: string | null
}

export interface AdminAlertUpdate {
  title?: string
  content?: string
  link?: string | null
  target_type?:
    | "all_users"
    | "org_members"
    | "org_owners"
    | "admins_only"
    | "specific_org"
  target_spectrum_id?: string | null
  active?: boolean
}

export interface AdminAlertsResponse {
  alerts: AdminAlert[]
  pagination: {
    page: number
    page_size: number
    total: number
    total_pages: number
    has_next: boolean
    has_prev: boolean
  }
}

export interface AdminAlertsQuery {
  page?: number
  pageSize?: number
  target_type?:
    | "all_users"
    | "org_members"
    | "org_owners"
    | "admins_only"
    | "specific_org"
  active?: boolean
}
