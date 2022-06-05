import { Story, Meta } from '@storybook/react';
import { UiEdu, UiEduProps } from './ui-edu';

export default {
  component: UiEdu,
  title: 'UiEdu',
} as Meta;

const Template: Story<UiEduProps> = (args) => <UiEdu {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
