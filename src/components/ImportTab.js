import React, { useState } from 'react';
import { UploadOutlined, DownloadOutlined, AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Popconfirm, message, Flex, Upload, Radio, Tabs, Typography, Steps, theme } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import { OcrParser } from '../lib/ocrParser';
import VerticalDivider from './VerticalDivider';
import { Message } from '../lib/message';

import sampleSave from '../data/sample-save.json';

const { Text } = Typography;

const spinnerMs = 500

function tryItOutTab() {
  function tryItOutClicked() {
    console.log('TRY')
    DB.setState(JSON.parse(JSON.stringify(sampleSave)))
    SaveState.save()
  }

  return (
    <Flex vertical gap={5}>
      <Text>
        If you would like to give the optimizer a try before doing any relic importing, use this to load a sample save file and check out the features.
      </Text>
      
      <Popconfirm
        title="Load sample save"
        description="Replace your current data with a sample save file?"
        onConfirm={tryItOutClicked}
        placement="bottom"
        okText="Yes"
        cancelText="Cancel"
      >
        <Button type="primary" style={{width: 200}}>
          Try it out!
        </Button>
      </Popconfirm>
    </Flex>
  )
}

function saveDataTab() {
  async function saveClicked() {
    try {
      let stateString = SaveState.save()
  
      const blob = new Blob(
        [ stateString ], 
        { type: 'text/json;charset=utf-8' }
      )
  
      const opts = {
        suggestedName: 'fribbels-optimizer-save',
        types: [{
          description: 'JSON',
          accept: {'text/json': ['.json']},
        }],
      };
      const handle = await window.showSaveFilePicker(opts);
      const writable = await handle.createWritable();
  
      await writable.write(blob);
      await writable.close();
      
      Message.success('Saved data')
    } catch (e) {
      console.warn(e)
    }
  }

  return (
    <Flex vertical gap={5}>
      <Text>
        Save your optimizer data to a file.
      </Text>
      <Button type="primary" onClick={saveClicked} icon={<DownloadOutlined />} style={{width: 200}}>
        Save Data
      </Button>
    </Flex>
  )
}

function clearDataTab() {
  const [loading, setLoading] = useState(false);

  function clearDataClicked() {
    console.log('Clear data')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      DB.resetState()

      Message.success('Cleared data')
    }, spinnerMs);
  }
  
  return (
    <Flex vertical gap={5}>
      <Text>
        Clear all optimizer data.
      </Text>
      <Popconfirm
        title="Erase all data"
        description="Are you sure to clear all relics and characters?"
        onConfirm={clearDataClicked}
        placement="bottom"
        okText="Yes"
        cancelText="Cancel"
      >
        <Button type="primary" loading={loading} style={{width: 200}}>
          Clear Data
        </Button>
      </Popconfirm>
    </Flex>
  )
}

function loadDataTab() {
  const [current, setCurrent] = useState(0);
  const [currentSave, setCurrentSave] = useState([]);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  
  const onStepChange = (value) => {
    console.log('onStepChange:', value);
    setCurrent(value);
  };

  function beforeUpload(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        let fileUploadText = reader.result;
        console.log('Uploaded file', fileUploadText);


        let save = JSON.parse(fileUploadText)
        console.log('Parsed save', save);

        setLoading1(true)
        
        setTimeout(() => {
          setLoading1(false)
          setCurrentSave(save)
          onStepChange(1)
        }, spinnerMs);
      };
      return false;
    });
  }

  function onUploadClick() {
    onStepChange(0)
  }

  function loadConfirmed() {
    setLoading2(true)
    setTimeout(() => {
      setLoading2(false)
      DB.setState(currentSave)
      SaveState.save()
      onStepChange(2)
    }, spinnerMs);
  }

  function loadDataContentUploadFile() {
    return (
      <Flex style={{minHeight: 100}}>
        <Flex vertical gap={10}>
          <Text>
            Load your optimizer data from a file.
          </Text>
          <Upload
            name= 'file'
            onClick={onUploadClick}
            beforeUpload={beforeUpload}>
            <Button style={{width: 200}} icon={<UploadOutlined />} loading={loading1}>
              Load Save Data
            </Button>
          </Upload>
        </Flex>
      </Flex>
    )
  }

  function confirmLoadData() {
    if (!currentSave || !currentSave.relics || !currentSave.characters) {
      return (
        <Flex style={{minHeight: 100}}>
          <Flex vertical gap={10} style={{display: current >= 1 ? 'flex' : 'none'}}>
            Invalid save file, please try a different file
          </Flex>
        </Flex>
      )
    }
    return (
      <Flex style={{minHeight: 100}}>
        <Flex vertical gap={10} style={{display: current >= 1 ? 'flex' : 'none'}}>
          <Text>
            File contains {currentSave.relics.length} relics and {currentSave.characters.length} characters. Replace your current data with the uploaded data?
          </Text>
          <Button style={{width: 200}} type="primary" onClick={loadConfirmed} loading={loading2}>
            Use Uploaded Data
          </Button>
        </Flex>
      </Flex>
    )
  }

  function loadCompleted() {
    return (
      <Flex style={{minHeight: 100}}>
        <Flex vertical gap={10} style={{display: current >= 2 ? 'flex' : 'none'}}>
          <Text>
            Done!
          </Text>
        </Flex>
      </Flex>
    )
  }

  return (
    <Flex gap={5}>
      <Steps
        direction="vertical"
        current={current}
        items={[
          {
            title: '',
            description: loadDataContentUploadFile(),
          },
          {
            title: '',
            description: confirmLoadData(),
          },
          {
            title: '',
            description: loadCompleted(),
          },
        ]}
      />
    </Flex>
  )
}


function relicImporterTab() {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [currentRelics, setCurrentRelics] = useState([]);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  
  const onStepChange = (value) => {
    console.log('onStepChange:', value);
    setCurrent(value);
  };

  function beforeUpload(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        let fileUploadText = reader.result;
        console.log('Uploaded text relicImporterTab', fileUploadText);
        
        let json = JSON.parse(fileUploadText);
        setLoading1(true)

        if (!json || !json.version) {
          setTimeout(() => {
            setLoading1(false)
            setCurrentRelics(undefined)
            onStepChange(1)
          }, spinnerMs);
          return
        }

        console.log('json', json);
        let relics = OcrParser.parse(json);

        setTimeout(() => {
          setLoading1(false)
          setCurrentRelics(relics)
          onStepChange(1)
        }, spinnerMs);
      };
      return false;
    });
  }

  function onUploadClick() {
    onStepChange(0)
  }

  function mergeConfirmed() {
    setLoading2(true)
    setTimeout(() => {
      setLoading2(false)
      StateEditor.mergeRelicsWithState(currentRelics)
      SaveState.save()
      onStepChange(2)
    }, spinnerMs);
  }

  function relicImporterContentUploadFile() {
    return (
      <Flex style={{minHeight: 100}}>
        <Flex vertical gap={10}>
          <Text>
            Upload the relic.json file from the OCR scanner.
          </Text>
          <Upload
            name= 'file'
            onClick={onUploadClick}
            beforeUpload={beforeUpload}>
            <Button style={{width: 200}} icon={<UploadOutlined />} loading={loading1}>
              Upload Relics
            </Button>
          </Upload>
        </Flex>
      </Flex>
    )
  }

  function confirmRelicMerge() {
    if (!currentRelics || !currentRelics.length) {
      return (
        <Flex style={{minHeight: 100}}>
          <Flex vertical gap={10} style={{display: current >= 1 ? 'flex' : 'none'}}>
            Invalid relics file, please try a different file
          </Flex>
        </Flex>
      )
    }

    return (
      <Flex style={{minHeight: 100}}>
        <Flex vertical gap={10} style={{display: current >= 1 ? 'flex' : 'none'}}>
          <Text>
            File contains {currentRelics.length} relics. Merge into your current save?
          </Text>
          <Button style={{width: 200}} type="primary" onClick={mergeConfirmed} loading={loading2}>
            Merge relics
          </Button>
        </Flex>
      </Flex>
    )
  }

  function mergeCompleted() {
    return (
      <Flex style={{minHeight: 100}}>
        <Flex vertical gap={10} style={{display: current >= 2 ? 'flex' : 'none'}}>
          <Text>
            Done!
          </Text>
        </Flex>
      </Flex>
    )
  }

  return (
    <Flex gap={5}>
      <Steps
        direction="vertical"
        current={current}
        items={[
          {
            title: '',
            description: relicImporterContentUploadFile(),
          },
          {
            title: '',
            description: confirmRelicMerge(),
          },
          {
            title: '',
            description: mergeCompleted(),
          },
        ]}
      />
    </Flex>
  )
}

export default function ImportTab({style}) {

  // Test
  let tabSize = 'large'

  return (
    <div style={style}>
      <Flex vertical gap={5}>
        <Tabs
          defaultActiveKey="1"
          size={tabSize}
          style={{
            marginBottom: 32,
          }}
          items={[
            {
              label: 'Relic importer',
              key: 0,
              children: relicImporterTab(),
            },
            {
              label: 'Load data',
              key: 1,
              children: loadDataTab(),
            },
            {
              label: 'Save data',
              key: 2,
              children: saveDataTab(),
            },
            {
              label: 'Clear data',
              key: 3,
              children: clearDataTab(),
            },
            {
              label: 'Try it out!',
              key: 4,
              children: tryItOutTab(),
            }
          ]}
          // items={new Array(3).fill(null).map((_, i) => {
          //   const id = String(i + 1);
          //   return {
          //     label: `Tab ${id}`,
          //     key: id,
          //     children: `Content of tab ${id}`,
          //   };
          // })}
        />
      </Flex>
    </div>
  );
}
