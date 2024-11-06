export interface UserResponse {
    results: {
        email: string;
        first_name: string;
        id: number;
        is_active: boolean;
        is_staff: boolean;
        is_superuser: boolean;
        last_name: string;
        username: string;
      }[]
}
