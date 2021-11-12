import * as React from 'react'
import { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import 'antd/dist/antd.css'
import { Upload, Tabs, message } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { RouteComponentProps } from 'react-router'

import { v4 as uuid } from 'uuid'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface FhirVizRouteParams {}

function FhirViz({ match }: RouteComponentProps<FhirVizRouteParams>): JSX.Element {
  const { Dragger } = Upload
  const { TabPane } = Tabs

  const [fileList, setFileList] = useState([])
  const [tabsList, setTabsList] = useState([])
  const [activeKey, setActiveKey] = useState(null as string)

  const onChange = (targetKey) => setActiveKey(targetKey)
  const remove = (targetKey) => {
    const idx = tabsList.map((t) => t.key).indexOf(targetKey)
    if (idx < 0) return

    const newTabs = tabsList.filter((pane) => pane.key !== targetKey)

    setTabsList(newTabs)
    setActiveKey(!newTabs.length ? null : idx > newTabs.length - 1 ? newTabs[newTabs.length - 1].key : newTabs[idx].key)
  }

  const onEdit = (targetKey, action) => {
    action === 'remove' && remove(targetKey)
  }

  const props = {
    name: 'file',
    multiple: true,
    action: 'https://fhirviz.icure.dev/rest/fhir/r4/viz/div/single',
    onChange(info) {
      const { status, name, response, uid } = info.file
      setFileList(info.fileList ?? [])

      if (status === 'done') {
        message.success(`${name} file uploaded successfully.`)
        if (response) {
          const key = uuid()
          setTabsList(tabsList.concat({ key: key, title: info.file.name, preview: response.toString() }).filter((_, idx, a) => a.length - idx <= 36))
          setActiveKey(key)
          setFileList(info.fileList.filter((x) => x.uid !== uid))
        }
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
        <p className="ant-upload-hint">{t('FhirViz.singleOrBulkSupport', 'Upload one or several FHIR files to get an inline preview')}</p>
      </Dragger>

      <Tabs hideAdd type="editable-card" onChange={onChange} activeKey={activeKey} onEdit={onEdit}>
        {tabsList.map((t, idx) => (
          <TabPane key={t.key} tab={t.title} closable={true}>
            <div className="preview" dangerouslySetInnerHTML={{ __html: t.preview }} />
          </TabPane>
        ))}
      </Tabs>
    </>
  )
}

export default FhirViz
