import React from "react";
import Tree from "./Tree";

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      folders: [],
      isLoading: false,
      filter: "",
      sort: {
        AZ: false,
        ZA: false
      }
    };
  }

  componentDidMount() {
    this.getFolderData();
  }

  getFolderData = () => {
    this.setState({
      isLoading: true
    });
    fetch(
      "https://raw.githubusercontent.com/wrike/frontend-test/master/data.json"
    )
      .then(response => response.json())
      .then(result => {
        this.setState({
          isLoading: false,
          folders: result
        });
      });
  };

  buildTree = array => {
    const result = [],
          map = {},
          { AZ, ZA } = this.state.sort,
          clonedArray = array.map(i => ({ ...i }));
    clonedArray.forEach(item => {
      if (map[item.id] && map[item.id].children) {
        item.children = map[item.id].children;
        if (AZ) item.children.sort();
        if (ZA) item.children.reverse();
      }
      map[item.id] = item;
      if (item.parentId === null) {
        result.push(item);
      } else {
        map[item.parentId] = map[item.parentId] || {};
        map[item.parentId].children = map[item.parentId].children || [];
        map[item.parentId].children.push(item);
        if (AZ) map[item.parentId].children.sort();
        if (ZA) map[item.parentId].children.reverse();
      }
    });
    return result;
  };

  getTree = (folders, filter) => {
    let tree = folders;
    if (filter) {
      const filteredFolders = folders.filter(item =>
        item.title.toLowerCase().includes(filter.toLowerCase())
      );
      const filteredFoldersParents = filteredFolders
        .flatMap(elem =>
          folders.filter(item => item.id === -1 || item.id === elem.parentId)
        )
        .concat(filteredFolders);
      tree = [...new Set(filteredFoldersParents)];
    }
    return this.buildTree(tree);
  };

  onChangeFilter = e => {
    this.setState({
      filter: e.target.value
    });
  };

  onSort = e => {
    const name = e.target.name;
    this.setState({
      sort: {
        AZ: name === "AZ" ? true : false,
        ZA: name === "ZA" ? true : false
      }
    });
  };

  render() {
    const {
      isLoading,
      folders,
      filter,
      sort: { AZ, ZA }
    } = this.state;
    const tree = this.getTree(folders, filter);
    return (
      <div>
        <div className="filters">
          <input
            type="text"
            onChange={this.onChangeFilter}
            className="input_search fontAwesome"
            placeholder="&#xF002;"
          />
          <div className="filters_button">
            <button
              name="AZ"
              onClick={this.onSort}
              className={AZ ? "button button_active" : "button"}
            >
              A-Z
            </button>
            <button
              name="ZA"
              onClick={this.onSort}
              className={ZA ? "button button_active" : "button"}
            >
              Z-A
            </button>
          </div>
        </div>
        {isLoading ? (
          <p>Loading data...</p>
        ) : (
          tree.map(item => {
            return <Tree item={item} key={item.id} />;
          })
        )}
      </div>
    );
  }
}
