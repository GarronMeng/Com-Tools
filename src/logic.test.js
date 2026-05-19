import { generateScript, getEventPlan } from './logic.js';

const tests = [
  {
    name: '异常报告 + 非常焦虑应为优先处理',
    input: {
      name: '测试客户',
      eventType: '体检报告异常',
      subject: '父母',
      ageGroup: '60岁以上',
      materialStatus: '有体检报告',
      emotion: '非常焦虑',
      region: '港深跨境',
      advisorGoal: '转介医生评估',
      note: '客户担心报告异常',
    },
    assert: (plan) => plan.priorityLabel === '优先处理',
  },
  {
    name: '父母健康关怀 + 日常关怀应为适合持续关怀',
    input: {
      name: '测试客户',
      eventType: '父母健康关怀',
      subject: '父母',
      ageGroup: '60岁以上',
      materialStatus: '暂无资料',
      emotion: '只是日常关怀',
      region: '深圳/大湾区',
      advisorGoal: '关怀客户',
      note: '',
    },
    assert: (plan) => plan.priorityLabel === '适合持续关怀',
  },
  {
    name: '未知事件应回退到体检报告异常',
    input: {
      name: '测试客户',
      eventType: '未知事件',
      subject: '本人',
      ageGroup: '45–60岁',
      materialStatus: '资料不完整',
      emotion: '普通咨询',
      region: '暂不确定',
      advisorGoal: '解释不同路径',
      note: '',
    },
    assert: (plan) => plan.outputTitle === '异常报告整理 + 专科评估路径',
  },
  {
    name: '单一话术应随语气变化',
    input: {
      name: '测试客户',
      eventType: '体检套餐选择',
      subject: '全家',
      ageGroup: '多代家庭',
      materialStatus: '暂无资料',
      emotion: '普通咨询',
      region: '港深跨境',
      advisorGoal: '安排体检',
      note: '客户想给父母安排体检',
    },
    assert: (plan, input) => generateScript(input, plan, 'warm') !== generateScript(input, plan, 'professional'),
  },
];

let failed = 0;
for (const test of tests) {
  const plan = getEventPlan(test.input);
  const passed = test.assert(plan, test.input);
  if (!passed) {
    failed += 1;
    console.error(`✗ ${test.name}`);
  } else {
    console.log(`✓ ${test.name}`);
  }
}

if (failed > 0) {
  console.error(`\n${failed} logic test(s) failed.`);
  process.exit(1);
}

console.log('\nAll logic tests passed.');
