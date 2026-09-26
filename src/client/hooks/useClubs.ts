import { useQuery } from 'react-query'
import { clubsQuery } from '@client/shared/queries'

/**
 * 동아리 목록(id/name/color)은 거의 바뀌지 않는 데이터라
 * staleTime을 길게 잡아서 화면 전환/재마운트마다 재조회하지 않도록 한다.
 * (Neon DB 사용량 절감 목적)
 */
export function useClubs(enabled = true) {
  return useQuery('clubs', clubsQuery, {
    enabled,
    staleTime: 1000 * 60 * 60, // 1시간
  })
}