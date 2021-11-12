import * as React from 'react'
import { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import 'antd/dist/antd.css'
import { Upload, message } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { RouteComponentProps } from 'react-router'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface FhirVizRouteParams {}

function FhirViz({ match }: RouteComponentProps<FhirVizRouteParams>): JSX.Element {
  const { Dragger } = Upload

  const [preview, setPreview] = useState('')
  const [fileList, setFileList] = useState([])

  const props = {
    name: 'file',
    multiple: false,
    action: 'https://fhirviz.icure.dev/rest/fhir/r4/viz/div/single',
    onChange(info) {
      const { status, response } = info.file
      setFileList((info.fileList ?? []).filter((f, idx) => idx === info.fileList.length - 1))

      if (status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`)
        if (response) {
          setPreview(response.toString())
        }
        setTimeout(() => setFileList([]), 2000)
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    },
  }

  const { t } = useTranslation()
  const dispatch = useDispatch()

  return (
    <>
      <Dragger {...props} fileList={fileList}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">{t('FhirViz.clickOrDrag', 'Click or drag file to this area to upload')}</p>
        <p className="ant-upload-hint">{t('FhirViz.singleOrBulkSupport', 'Upload a single file to get an inline preview')}</p>
      </Dragger>
      <div className="preview" dangerouslySetInnerHTML={{ __html: preview }} />
    </>
  )
}

export default FhirViz
