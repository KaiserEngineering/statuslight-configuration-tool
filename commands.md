### SHIFT
Sending the <code>SHIFT</code> command will return the current shift point of the Shift Light.
```
SHFT
6200
```

### SHIFT [RPM]
Sending the <code>SHIFT</code> followed by an integer will set the current shift point of the Shift Light.Shift Light.
```
SHFT 5000
OK
```

### ACT
```
ACT
2500
```

### ACT [RPM]
```
ACT 2000
OK
```

### COLOR
```
COLOR
1
```

### COLOR [enum color]
```
COLOR 0
OK
```

### ANIM
Sending the <code>ANIM</code> command will return the current animation configuration of the Shift Light.
```
ANIM
2
```

### ANIM [enum animation]
Sending the <code>ANIM</code> followed by an integer will set the current animation configuration of the Shift Light.
```
ANIM 3
OK
```