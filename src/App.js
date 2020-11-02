import React, { useState, useEffect } from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Modal,
  Fade,
  Backdrop,
  TextField,
  List,
  ListItem,
  Button,
} from "@material-ui/core";
import Swal from "sweetalert2";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import RefreshIcon from "@material-ui/icons/Refresh";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
const useStyles = makeStyles({
  root: {
    maxWidth: 275,
    margin: "1rem",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0,8)",
  },
  title: {
    fontSize: 14,
  },
  root2: {
    width: 500,
  },
});
const useStyles2 = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  }
}));
function App() {
  const classes = useStyles();
  const classes2 = useStyles2();
  const [data, setData] = useState([]);
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [datos, setDatos] = useState({
    Nombres: "",
    DNI: "",
    Celular: "",
    Correo: "",
  });
  const handleInputChange = (event) => {
    setDatos({
      ...datos,
      [event.target.name]: event.target.value,
    });
  };
  const enviarDatos = async (event) => {
    event.preventDefault();
    const forming = {
      Nombres: datos.Nombres,
      DNI: datos.DNI,
      Celular: datos.Celular,
      Correo: datos.Correo,
    };
    axios.post("http://localhost:4000/userInsert", forming).then((res) => {
      handleClose();
      Swal.fire({
        icon: "success",
        title: "Registrado correctamente",
        text: "Puede revisar sus datos en otras pestañas",
      });
    });
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    const fetching = async () => {
      const response = await axios("http://localhost:4000/user");
      const res = await response.data;
      setData(res);
    };
    fetching();
  }, []);
  const changingData = async (value, id) => {
    let updating = {
      Nombres: id.value,
      DNI: value.DNI,
      Celular: value.Celular,
      Correo: value.Correo,
    };
    const request = await axios.patch(
      `http://localhost:4000/user/${value._id}`,
      updating
    );
    if (request.status === 200) {
      Swal.fire({
        icon: "success",
        title: "Actualizado correctamente",
        text: "Puede revisar sus datos",
      });
    }
  };
  const handleDelete = async (value) => {
    const deleting = await axios.delete(`http://localhost:4000/user/${value._id}`)
    if (deleting.status === 200) {
      Swal.fire({
        icon: "success",
        title: "Usuario Eliminado correctamente",
        text: "Puede revisar sus datos",
      });
    }
  };
  return (
    <div className="App">
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        showLabels
        className={classes.root2}
      >
        <BottomNavigationAction
          label="Add"
          icon={<AddCircleIcon />}
          onClick={handleOpen}
        />
        <BottomNavigationAction label="Actualizar Pagina" icon={<RefreshIcon />} href="http://localhost:3000/">
        </BottomNavigationAction>
      </BottomNavigation>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes2.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes2.paper}>
            <h2 id="transition-modal-title">Inserte datos</h2>
            <div>
              <form
                style={{ margin: "1rem", display: "grid" }}
                onSubmit={enviarDatos}
              >
                <TextField
                  label="Nombres"
                  variant="outlined"
                  name="Nombres"
                  style={{ marginBottom: "1em" }}
                  onChange={handleInputChange}
                />
                <TextField
                  label="DNI"
                  variant="outlined"
                  name="DNI"
                  style={{ marginBottom: "1em" }}
                  onChange={handleInputChange}
                />
                <TextField
                  label="Celular"
                  variant="outlined"
                  name="Celular"
                  type="number"
                  style={{ marginBottom: "1em" }}
                  onChange={handleInputChange}
                />
                <TextField
                  label="Correo"
                  variant="outlined"
                  name="Correo"
                  style={{ marginBottom: "1em" }}
                  onChange={handleInputChange}
                />
                <input type="submit" />
              </form>
            </div>
          </div>
        </Fade>
      </Modal>
      <List>
        {data.length > 0 ? (
          data.map((item) => (
            <ListItem key={item._id} className={classes2.root}>
              <TextField
                id="Value"
                variant="outlined"
                name="Nombres"
                placeholder={item.Nombres}
                onChange={(e) => e.target.value}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => changingData(item, document.getElementById("Value"))}
              >
                Editar
              </Button>
              <Button variant="contained" color="secondary" onClick={() => handleDelete(item)}>
                Eliminar
              </Button>
            </ListItem>
          ))
        ) : (
          <p>No hay data</p>
        )}
      </List>
    </div>
  );
}

export default App;
