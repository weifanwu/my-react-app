import { xor } from 'lodash';
import React, { useState, useContext } from 'react';
import styles from './index.css';
import { history } from 'umi';
import _ from 'lodash';
//import { MyContext } from "../../GlobalStateContext.js";
/**
 *
 * @param
 * - props
 * - courses: 课程列表， 类型为数组或对象
 *
 * 课程推荐组件的内容组件
 */
function Rol(props: any) {
  //  const { course, updateName } = useContext(MyContext);
  const { courses } = props;
  //   co
  let redirectHandler = (e: any) => {
    let courseCode = e.currentTarget.getAttribute('key-data');
    console.log(e.currentTarget, '跳转去： ', courseCode);
    //    updateName(courseCode);
    //    console.log("Testing: " + course);
    history.push('/courseInfo/detail?code=' + courseCode);
  };

  let cards;

  if (courses instanceof Array) {
    cards = courses.map((payload: any) => {
      let breifInfo = payload['tags'].length
        ? payload.tags.join(', ') + ' | '
        : '';
      breifInfo += payload['credit'] + ' CRs';
      return (
        <div>
          <div
            className={styles.singleCard}
            key-data={payload['course_code']}
            onClick={redirectHandler}
          >
            <div className={styles.fillContent}>{payload['course_code']}</div>
          </div>
          <p className={styles.textContent}>{payload['course_code']}</p>
          <p className={styles.breifInfo}>{breifInfo}</p>
        </div>
      );
    });
    return <div className={styles.cardsContainer}>{cards}</div>;
  } else {
    let cardsWithTitle = [];
    let keys = _.keys(courses);
    for (let key of keys) {
      let subcards = courses[key].map((payload: any) => {
        let breifInfo = payload['tags'].length
          ? payload.tags.join(', ') + ' | '
          : '';
        breifInfo += payload['credit'] + ' CRs';
        return (
          <div style={{ marginBottom: '9px' }}>
            <div
              className={styles.singleCard}
              key-data={payload['course_code']}
              onClick={redirectHandler}
            >
              <div className={styles.fillContent}>{payload['course_code']}</div>
            </div>
            <p className={styles.textContent}>{payload['course_code']}</p>
            <p className={styles.breifInfo}>{breifInfo}</p>
          </div>
        );
      });

      cardsWithTitle.push(
        <div className={styles.rolInRols}>
          <div className={styles.subTitle}>{key.split('_').join(' ')}</div>
          <div className={styles.cardsContainer}>{subcards}</div>
        </div>,
      );
    }
    return <div className={styles.rolsContainer}>{cardsWithTitle}</div>;
  }
}

export default Rol;
