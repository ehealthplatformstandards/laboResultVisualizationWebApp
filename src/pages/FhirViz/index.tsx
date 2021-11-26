import * as React from 'react'
import { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import 'antd/dist/antd.css'
import { Upload, Tabs, message, Switch, Button, Modal } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { RouteComponentProps } from 'react-router'

import { v4 as uuid } from 'uuid'
import { TabsType } from 'antd/es/tabs'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface FhirVizRouteParams {}

function FhirViz({ match }: RouteComponentProps<FhirVizRouteParams>): JSX.Element {
  const { Dragger } = Upload
  const { TabPane } = Tabs

  const [fileList, setFileList] = useState([])
  const [tabsList, setTabsList] = useState([])
  const [activeKey, setActiveKey] = useState(null as string)
  const [validate, setValidate] = useState(true)
  const [displayedValidation, setDisplayedValidation] = useState(null as string)

  const tabsProps = {
    hideAdd: true,
    type: 'editable-card' as TabsType,
    activeKey: activeKey,
    onChange: (targetKey: string) => setActiveKey(targetKey),
    onEdit: (targetKey: any, action: 'remove' | 'add') => {
      if (action === 'remove') {
        const idx = tabsList.map((t) => t.key).indexOf(targetKey)
        if (idx < 0) return

        const newTabs = tabsList.filter((pane) => pane.key !== targetKey)

        setTabsList(newTabs)
        setActiveKey(!newTabs.length ? null : idx > newTabs.length - 1 ? newTabs[newTabs.length - 1].key : newTabs[idx].key)
      }
    },
  }

  const draggerProps = {
    name: 'file',
    multiple: true,
    action: validate ? 'https://fhirviz.icure.dev/rest/fhir/r4/viz/div/single/validate' : 'https://fhirviz.icure.dev/rest/fhir/r4/viz/div/single',
    onChange: async (info: any) => {
      const { status, name, response, uid } = info.file
      setFileList(info.fileList ?? [])

      if (status === 'done') {
        message.success(`${name} file uploaded successfully.`)
        if (response) {
          const key = uuid()
          setTabsList(
            tabsList
              .concat(
                validate
                  ? { key: key, title: info.file.name, preview: response.html, errors: response.errors, validation: response.validation }
                  : { key: key, title: info.file.name, preview: response.toString() },
              )
              .filter((_, idx, a) => a.length - idx <= 36),
          )
          setActiveKey(key)
          setFileList(fileList.filter((x: any) => x.uid !== uid))
        }
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
        setFileList(fileList.filter((x: any) => x.uid !== uid))
      }
    },
    onDrop(e: any) {
      console.log('Dropped files', e.dataTransfer.files)
    },
  }

  const { t } = useTranslation()
  const dispatch = useDispatch()

  return (
    <>
      <p>
        Perform validation on uploaded files: <Switch checked={validate} onChange={(checked) => setValidate(checked)} />
      </p>
      <Dragger {...draggerProps} fileList={fileList}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">{t('FhirViz.clickOrDrag', 'Click or drag file to this area to upload')}</p>
        <p className="ant-upload-hint">{t('FhirViz.singleOrBulkSupport', 'Upload one or several FHIR files to display a rendered document')}</p>
      </Dragger>

      <Tabs {...tabsProps}>
        {tabsList.map((t, idx) => (
          <TabPane key={t.key} tab={t.title} closable={true}>
            {t.validation && (
              <Button className={['validationButton', t.errors ? 'red' : 'green'].join(' ')} type="primary" shape="round" onClick={() => setDisplayedValidation(t.validation)}>
                {t.errors} {t.errors > 1 ? 'errors' : 'error'}
              </Button>
            )}
            <div className="preview" dangerouslySetInnerHTML={{ __html: t.preview }} />
          </TabPane>
        ))}
      </Tabs>

      <Modal width={'1280px'} footer={null} title={null} visible={!!displayedValidation} onOk={() => setDisplayedValidation(null)} onCancel={() => setDisplayedValidation(null)}>
        <iframe style={{ border: 0, outline: 'none', height: '860px', width: '100%' }} srcDoc={displayedValidation} />
      </Modal>
    </>
  )
}

export default FhirViz
