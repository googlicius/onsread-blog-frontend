import PropTypes from 'prop-types';

interface Props {
  fill?: string;
}

const ArrowBack = ({ fill = 'currentColor' }: Props) => (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <title>arrow_back</title>
    <path
      d="M20.016 11.016v1.969h-12.188l5.578 5.625-1.406 1.406-8.016-8.016 8.016-8.016 1.406 1.406-5.578 5.625h12.188z"
      fill={fill}
    ></path>
  </svg>
);

ArrowBack.propTypes = {
  fill: PropTypes.string,
};

export default ArrowBack;
