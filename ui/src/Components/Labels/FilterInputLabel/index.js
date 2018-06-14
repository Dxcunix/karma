import React from "react";
import PropTypes from "prop-types";

import { observer } from "mobx-react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons/faExclamationCircle";
import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner";

import { AlertStore } from "Stores/AlertStore";
import { DefaultLabelClass } from "Common/Colors";
import { QueryOperators } from "Common/Query";
import { BaseLabel } from "Components/Labels/BaseLabel";

import "./index.css";

const FilterInputLabel = observer(
  class FilterInputLabel extends BaseLabel {
    static propTypes = {
      alertStore: PropTypes.instanceOf(AlertStore).isRequired,
      filter: PropTypes.shape({
        raw: PropTypes.string,
        applied: PropTypes.bool,
        hits: PropTypes.number,
        name: PropTypes.string,
        matcher: PropTypes.string,
        value: PropTypes.string
      })
    };

    render() {
      const { filter, alertStore } = this.props;

      let classNames = [
        "components-label",
        "components-filteredinputlabel",
        "badge",
        "text-nowrap",
        "text-truncate",
        "mw-100"
      ];
      let style = {};
      if (!filter.applied) {
        classNames.push("badge-secondary");
      } else if (filter.matcher === QueryOperators.Equal) {
        // only pass color class & style for equality matchers (foo=bar)
        // if we have foo!=bar filter then it should't get the color we use
        // for "foo: bar" labels
        classNames.push(
          `badge-${this.getColorClass(filter.name, filter.value)}`
        );
        style = this.getColorStyle(filter.name, filter.value);
      } else {
        classNames.push(`badge-${DefaultLabelClass}`);
      }

      return (
        <span className={classNames.join(" ")} style={style}>
          <button
            type="button"
            className="close ml-1"
            style={style}
            onClick={() => alertStore.filters.removeFilter(filter.raw)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
          {filter.isValid ? (
            filter.applied ? (
              <span className="badge badge-light badge-pill mr-1">
                {filter.hits}
              </span>
            ) : (
              <span className="mr-1">
                <FontAwesomeIcon icon={faSpinner} spin />
              </span>
            )
          ) : (
            <span className="text-danger mr-1">
              <FontAwesomeIcon icon={faExclamationCircle} />
            </span>
          )}

          {filter.raw}
        </span>
      );
    }
  }
);

export { FilterInputLabel };
