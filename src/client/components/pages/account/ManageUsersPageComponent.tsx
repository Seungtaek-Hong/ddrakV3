import Row from '@client/components/layout/shared/Row'
import { Input, Select } from '@components/form'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAccount } from '@client/hooks'
import { useQuery, useMutation } from 'react-query'
import { usersQuery, updateUserMutation } from '@client/shared/queries'

import { InputChangeParams } from '@shared/types'
import { PATHNAME } from '@root/src/client/consts'
import { PASSWORD_INPUT_MAX_LENGTH } from '@client/consts'

import classNames from 'classnames/bind'
import styles from './style/Account.module.css'
const cx = classNames.bind(styles)

export default function ManageUsersPageComponent() {
  const router = useRouter()
  const { isLoggedIn, me } = useAccount()

  const [formState, setFormState] = useState({
    userId: undefined,
    newPassword: '',
    newPasswordConfirm: '',
  })
  const [formErrorState, setFormErrorState] = useState({
    newPassword: undefined,
    newPasswordConfirm: undefined,
  })

  const { data } = useQuery('users', usersQuery, {
    enabled: !!me?.isSuper,
  })
  const users = data?.users ?? []
  const userOptions = users.map(user => ({
    value: user.id,
    label: `${user.name}${user.club?.name ? ` (${user.club.name})` : ''}`,
  }))

  useEffect(() => {
    if (formState.userId === undefined && userOptions.length > 0) {
      setFormState(prev => ({ ...prev, userId: userOptions[0].value }))
    }
  }, [userOptions])

  const { mutate, isLoading } = useMutation(updateUserMutation, {
    onSuccess: () => {
      alert('비밀번호가 변경되었습니다!')
      setFormState(prev => ({ ...prev, newPassword: '', newPasswordConfirm: '' }))
    },
    onError: () => {
      alert('비밀번호 변경에 실패했습니다. 다시 시도해주세요.')
    },
  })

  function handleInputChange({ name, value }: InputChangeParams) {
    setFormState(prev => ({ ...prev, [name]: value }))
  }

  function getIsFormValid() {
    let isValid = true
    const curFormErrorState = {
      newPassword: undefined,
      newPasswordConfirm: undefined,
    }

    if (!formState.userId) {
      alert('계정을 선택해주세요')
      return false
    }

    if (formState.newPassword.length < 1) {
      curFormErrorState.newPassword = '새 비밀번호를 입력하세요'
      isValid = false
    } else if (formState.newPassword.search(/\s/) !== -1) {
      curFormErrorState.newPassword = '비밀번호에는 공백이 들어갈 수 없습니다'
      isValid = false
    } else if (formState.newPassword !== formState.newPasswordConfirm) {
      curFormErrorState.newPasswordConfirm = '비밀번호가 일치하지 않습니다'
      isValid = false
    }

    setFormErrorState(curFormErrorState)
    return isValid
  }

  function handleSubmit(e: React.SyntheticEvent) {
  e.preventDefault()
  if (isLoading) return

  if (getIsFormValid()) {
    mutate({
      id: Number(formState.userId),
      password: formState.newPassword,
    })
  }
}

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  function goHome(e: React.SyntheticEvent) {
    e.preventDefault()
    router.push(PATHNAME.HOME)
  }

  if (!isLoggedIn || !me?.isSuper) {
    return (
      <Row>
        <div className={cx('root')}>
          <div className={cx('container')}>
            <div className={cx('header-title')}>
              <h1>권한이 없습니다</h1>
            </div>
            <div className={cx('buttons-container')}>
              <button className={cx('button', 'home')} onClick={goHome}>
                홈으로
              </button>
              {!isLoggedIn && (
                <button className={cx('button', 'login')} onClick={() => router.push(PATHNAME.LOGIN)}>
                  로그인
                </button>
              )}
            </div>
          </div>
        </div>
      </Row>
    )
  }

  return (
    <Row>
      <div className={cx('root')}>
        <div className={cx('container')}>
          <div className={cx('header-title')}>
            <h1>계정 관리</h1>
          </div>
          <form className={cx('login-form')} name="manage-users">
            <div className={cx('input-wrapper')}>
              <label>계정 선택</label>
              <Select
                className={cx('select')}
                name="userId"
                onChange={handleInputChange}
                value={formState.userId}
                options={userOptions}
              />
            </div>
            <div className={cx('input-wrapper')}>
              <label>새 비밀번호</label>
              <Input
                type="password"
                value={formState.newPassword}
                name="newPassword"
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="새 비밀번호를 입력하세요"
                maxLength={PASSWORD_INPUT_MAX_LENGTH}
                onKeyPress={handleKeyPress}
                errorMsg={formErrorState.newPassword}
              />
            </div>
            <div className={cx('input-wrapper')}>
              <label>새 비밀번호 확인</label>
              <Input
                type="password"
                value={formState.newPasswordConfirm}
                name="newPasswordConfirm"
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="새 비밀번호를 다시 입력하세요"
                maxLength={PASSWORD_INPUT_MAX_LENGTH}
                onKeyPress={handleKeyPress}
                errorMsg={formErrorState.newPasswordConfirm}
              />
            </div>
            <div className={cx('buttons-container', { disabled: isLoading })}>
              <button className={cx('button', 'home')} onClick={goHome}>
                홈으로
              </button>
              <button className={cx('button')} type="submit" onClick={handleSubmit} disabled={isLoading}>
                비밀번호 변경
              </button>
            </div>
          </form>
        </div>
      </div>
    </Row>
  )
}