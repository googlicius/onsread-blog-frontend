import PropTypes from 'prop-types';

interface Props {
  fill?: string;
}

const NotificationSvg = ({ fill = 'currentColor' }: Props) => (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <title>notifications</title>
    <path
      d="M18 15.984l2.016 2.016v0.984h-16.031v-0.984l2.016-2.016v-4.969q0-2.344 1.195-4.078t3.305-2.25v-0.703q0-0.609 0.422-1.055t1.078-0.445 1.078 0.445 0.422 1.055v0.703q2.109 0.516 3.305 2.25t1.195 4.078v4.969zM12 21.984q-0.844 0-1.43-0.563t-0.586-1.406h4.031q0 0.797-0.609 1.383t-1.406 0.586z"
      fill={fill}
    ></path>
  </svg>
);

NotificationSvg.propTypes = {
  fill: PropTypes.string,
};

export default NotificationSvg;
