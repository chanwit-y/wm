import { ComponentStory, ComponentMeta } from '@storybook/react';
import { removeClassNameElement } from './index';

export default {
  component: removeClassNameElement,
  title: 'removeClassNameElement',
} as ComponentMeta<typeof removeClassNameElement>;

const Template: ComponentStory<typeof removeClassNameElement> = (args) => (
  <removeClassNameElement {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
