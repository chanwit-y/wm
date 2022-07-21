import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Test } from './index';

export default {
  component: Test,
  title: 'Test',
} as ComponentMeta<typeof Test>;

const Template: ComponentStory<typeof Test> = (args) => <Test {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
