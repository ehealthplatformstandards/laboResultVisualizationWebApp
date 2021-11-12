import * as React from 'react'
import { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { Button, Form, FormInstance, Input, notification } from 'antd'
import { Link } from 'react-router-dom'
import Icon from '../../elements/Icon'

interface InviteRouteParams {
  id: string
  token: string
}

const firstTimeLogin = +new Date()
const retryLogin: NodeJS.Timeout | undefined = undefined

function Login({ match }: RouteComponentProps<InviteRouteParams>): JSX.Element {
  const [loggingIn] = useState(false)
  const [message, setMessage] = useState('')
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const { getFieldError, isFieldTouched } = form
  const usernameError = isFieldTouched('username') && getFieldError('username')
  const passwordError = isFieldTouched('password') && getFieldError('password')

  const handleSubmit = async (values: { [key: string]: string }) => {
    try {
    } catch (e) {
      notification.error({
        message: message,
      })
    }
  }

  function hasErrors(form: FormInstance) {
    return !!form.getFieldsError().filter(({ errors }) => errors.length).length
  }

  return (
    <div className="log-wrap">
      <Link to="/" className="log__backlink">
        <Icon name="arrow-left" />
      </Link>
      <div id="container">
        <h1>Cloud Manager Login</h1>
        <Form form={form} onFinish={(values) => handleSubmit(values)} className="login-form" colon={false}>
          <Form.Item
            label={t('Login.nom-utilisateur')}
            name="username"
            validateStatus={usernameError ? 'error' : ''}
            help={usernameError || ''}
            rules={[
              {
                required: true,
                message: t('Login.veuillez-introduire-votre-identifiant'),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t('Login.mot-passe')}
            validateStatus={passwordError ? 'error' : ''}
            help={passwordError || ''}
            name="password"
            rules={[
              {
                required: true,
                message: t('Login.veuillez-introduire-votre-mot-passe'),
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <div className="d-flex justify-content-center mt-4">
            <Button htmlType="submit" className="blue xl" disabled={hasErrors(form) || loggingIn}>
              Login
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default Login
