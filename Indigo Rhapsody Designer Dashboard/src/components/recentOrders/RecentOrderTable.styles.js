import styled from "styled-components";
import { media } from "../../styles/theme/theme";

export const RecentOrderWrap = styled.div`
  margin-top: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
  padding: 20px;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 20px;

  h2 {
    margin-bottom: 20px;
    font-size: 26px;
    color: #333;
    font-weight: 600;
  }

  table {
    width: 100%;
    background-color: #ffffff;
    border-collapse: separate;
    border-spacing: 0;
    border-radius: 12px;
    overflow: hidden;
    margin-top: 10px;
  }

  th,
  td {
    padding: 14px 20px;
    text-align: left;
    border-bottom: 1px solid #e6e6e6;
    font-size: 16px;
    color: #555;
  }

  th {
    font-weight: 600;
    color: #333;
  }

  tr {
    transition: background-color 0.3s ease;
  }

  tr:hover {
    background-color: #fafafa;
  }

  td:first-child,
  th:first-child {
    border-radius: 8px 0 0 8px;
  }

  td:last-child,
  th:last-child {
    border-radius: 0 8px 8px 0;
  }

  .status {
    margin-top: 12px;
    display: inline-block;
    padding: 6px 14px;
    border-radius: 25px;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    text-transform: capitalize;
    background-color: #ff9800;
  }

  .status.confirmed {
    background-color: #03a9f4;
  }

  ${media.sm`
    th, td {
      padding: 10px 15px;
      font-size: 14px;
    }

    h2 {
      font-size: 22px;
    }
  `}

  ${media.xs`
    th, td {
      padding: 8px 12px;
      font-size: 12px;
    }

    h2 {
      font-size: 18px;
    }
  `}
`;
