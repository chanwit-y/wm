import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Autocomplete } from './index';

export default {
  component: Autocomplete,
  title: 'Autocomplete',
} as ComponentMeta<typeof Autocomplete>;

const Template: ComponentStory<typeof Autocomplete> = (args) => (
  <Autocomplete {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
