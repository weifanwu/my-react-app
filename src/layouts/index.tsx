import React from 'react';
import { history } from 'umi';
import { useEffect, useState } from 'react';
import styles from './index.css';
import { connect } from 'dva';
import NavBar from '@/components/navBar';
import axios from 'axios';
import { Tag, Divider, Menu } from 'antd';
import { AiFillGithub } from 'react-icons/ai';
//import loading from '@/assets/loading.gif'

/**
 * courseInfo页面最上边的那个显示课程信息的组件
 * @param props
 */
function headArea(props: any) {
  const { updateProfessor, updateCourseCode, courseCode } = props;
  const initialState = {
    tags: [],
    course_code: '',
    course_title: '',
    credit: '',
    description: '',
  };
  const [state, setState] = useState(initialState);
  const [currentKey, setCurrentKey] = useState('detail');
  useEffect(() => {
    //判断当前的路径是否合法，若不合法，则跳回home界面
    if (
      ['/courseInfo/detail'].includes(history.location.pathname) &&
      !history.location.query.code
    ) {
      history.push('/');
    }
    if (['/courseInfo/QA'].includes(history.location.pathname)) {
      setCurrentKey('QA');
    }
  });
  useEffect(() => {
    let code: string | string[] | null = history.location.query
      ? history.location.query.code
      : '';
    axios
      .get(
        'https://capstone2022-342303.uw.r.appspot.com/course/info?course_code=' +
          code,
      )
      .then((Response) => {
        setState(Response.data.data);
        updateCourseCode(Response.data.data.course_code);
        updateProfessor(Response.data.data.professors);
      });
  }, [courseCode]);
  //把tags转换为标签组件
  const tags = !state.tags.length
    ? []
    : state.tags.map((val: string) => {
        return (
          <Tag color="#a78cf2" style={{ borderRadius: '20px' }}>
            {val}
          </Tag>
        );
      });

  //点击tab时的回调, 如果目前的currentkey和被点击的tab的key不一样，则改变目前的key并发生跳转
  let clickHandler = (e: any) => {
    if (currentKey != e.key) {
      setCurrentKey(e.key);
      history.push(`/courseInfo/${e.key}?code=${courseCode}`);
    }
  };

  if (state.course_code.length) {
    return (
      <div className={styles.backGroundPage}>
        <div className={styles.navWrapper}>
          <NavBar setTab={setCurrentKey} />
        </div>
        <div className={styles.headArea}>
          {/* <Divider style={{ marginBottom: '-2px', marginTop: '12px'}} /> */}
          <h2 style={{ display: 'inline-block', padding: '30px 30px 0px' }}>
            {state.course_code} {state.course_title} (
            {state.credit == '' ? 'Na' : state.credit})
          </h2>
          <div style={{ padding: '0 30px 15px' }}>{tags}</div>
          <div style={{ width: '70%', marginBottom: '3vh' }}>
            <p className={styles.courseDescribtion}>{state.description}</p>
          </div>
          <div style={{ borderRadius: '14px' }}>
            <Menu
              onClick={clickHandler}
              mode="horizontal"
              selectedKeys={[currentKey]}
              style={{ paddingLeft: '10px', borderRadius: '14px' }}
            >
              <Menu.Item key="detail">Course Overview</Menu.Item>
              <Menu.Item key="QA">Discussion</Menu.Item>
            </Menu>
          </div>
        </div>
        <div className={styles.cardsContainer}>{props.children}</div>
      </div>
    );
  } else {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <div className={styles.loader}>
          <img
            style={{ width: '20vw', height: '30vh' }}
            src={require('@/assets/loading.gif')}
            alt="loading"
          />
          <div
            style={{
              fontSize: 'xx-large',
              color: 'white',
              position: 'relative',
              left: '9%',
            }}
          >
            Loading...
          </div>
        </div>
      </div>
    );
  }
}

const mapStateProps = (state: any) => {
  return {
    professors: state.courseInfo.professors,
    courseCode: state.courseInfo.courseCode,
  };
};

const actionCreator = {
  updateProfessor: (payload: string[]) => {
    return {
      type: 'courseInfo/updateProfessor',
      payload,
    };
  },
  updateCourseCode: (payload: string) => {
    return {
      type: 'courseInfo/updateCourseCode',
      payload,
    };
  },
};

export default connect(mapStateProps, actionCreator)(headArea);
