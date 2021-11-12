import React from 'react'
import Helmet from 'react-helmet'
import { withTranslation } from 'react-i18next'

const NotFound = props => {
  const { t, i18n } = props
  return (
    <div>
      <Helmet title={t('pages.not-found')} />
      <div className="content">
        <div className="">{t('pages.page-not-found')}</div>
        <p>{t('pages.page-your-are-looking-for')}</p>
      </div>
    </div>
  )
}

export default withTranslation(NotFound)
