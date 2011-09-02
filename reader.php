<?php
$class_id = array(1 => "UndefinedObject", 2 => "True", 3 => "False", 4 => "SmallInteger", 5 => "SmallInteger16", 6 => "LargePositiveInteger", 7 => "LargeNegativeInteger", 8 => "Float", 9 => "String", 10 => "Symbol", 11 => "ByteArray", 12 => "SoundBuffer", 13 => "Bitmap", 14 => "UTF8", 20 => "Array", 21 => "OrderedCollection", 22 => "Set", 23 => "IdentitySet", 24 => "Dictionary", 25 => "IdentityDictionary", 30 => "Color", 31 => "TranslucentColor", 32 => "Point", 33 => "Rectangle", 34 => "Form", 35 => "ColorForm", 99 => "ObjectRef", 100 => "Morph", 101 => "BorderedMorph", 102 => "RectangleMorph", 103 => "EllipseMorph", 104 => "AlignmentMorph", 105 => "StringMorph", 106 => "UpdatingStringMorph", 107 => "SimpleSliderMorph", 108 => "SimpleButtonMorph", 109 => "SampledSound", 110 => "ImageMorph", 111 => "SketchMorph", 123 => "SensorBoardMorph", 124 => "ScratchSpriteMorph", 125 => "ScratchStageMorph", 140 => "ChoiceArgMorph", 141 => "ColorArgMorph", 142 => "ExpressionArgMorph", 145 => "SpriteArgMorph", 147 => "BlockMorph", 148 => "CommandBlockMorph", 149 => "CBlockMorph", 151 => "HatBlockMorph", 153 => "ScratchScriptsMorph", 154 => "ScratchSliderMorph", 155 => "WatcherMorph", 157 => "SetterBlockMorph", 158 => "EventHatMorph", 160 => "VariableBlockMorph", 162 => "ImageMedia", 163 => "MovieMedia", 164 => "SoundMedia", 165 => "KeyEventHatMorph", 166 => "BooleanArgMorph", 167 => "EventTitleMorph", 168 => "MouseClickEventHatMorph", 169 => "ExpressionArgMorphWithMenu", 170 => "ReporterBlockMorph", 171 => "MultilineStringMorph", 172 => "ToggleButton", 173 => "WatcherReadoutFrameMorph", 174 => "WatcherSliderMorph");
$file = array();
$objects = array();

foreach (str_split(file_get_contents($_FILES["sbfile"]["tmp_name"])) as $byte)
{
    array_push($file, ord($byte));
}

if (read_header())
{
    if (next_string(2) == 0)
    {
        die("This project is too old!");
    }
    else
    {
        next_uint(4);
        read_object();
        $object = read_object();
        print_objects($object);
        
        //echo "<hr>";
        
  //      $object = fix_object(0);
//        print_r($object);
    }
}
else
{
    die("This file is not a Scratch file!");
}

function next_byte()
{
    static $i = 0;
    $n = $GLOBALS["file"][$i];
    $i++;
    return $n;
}

function next_length($length)
{
    $array = array();
    for ($i = 1; $i <= $length; $i++)
    {
        array_push($array, next_byte());
    }
    return $array;
}

function read_header()
{
    return next_string(8) == "ScratchV";
}

function next_string($length)
{
    $string = "";
    foreach (next_length($length) as $byte)
    {
        $string = $string . chr($byte);
    }
    return $string;
}

function next_uint($length)
{
    $int = 0;
    $i = 1;
    foreach (array_reverse(next_length($length)) as $byte)
    {
        $int += $byte * $i;
        $i *= 256;
    }
    return $int;
}

function next_int($length)
{
    $int = 0;
    $i = 1;
    foreach (next_length($length) as $byte)
    {
        $int += $byte * $i;
        $i *= 256;
    }
    return $int;
}

function read_obj_header()
{
    return next_string(4) == 'ObjS' && next_byte() == 1 && next_string(4) == 'Stch' && next_byte() == 1;
}

function read_object()
{
    if (read_obj_header())
    {
        $size = next_uint(4);
        
        $fields = array();
        for ($i = 1; $i <= $size; $i++)
        {
            $field = read_field();
            array_push($fields, $field);
        }
        return $fields;
    }
    else
    {
        die("Not an Object!");
    }
}

function read_field()
{
    $class_ID = next_byte();
    $class_name = $GLOBALS["class_id"][$class_ID];
    switch ($class_name)
    {    
        case "ObjectRef":
            $result = array(next_uint(3));
            break;
        case "UndefinedObject":
            $result = array();
            break;
        case "True":
            $result = array();
            break;
        case "False":
            $result = array();
            break;
        case "SmallInteger":
            $result = array(next_uint(4));
            break;
        case "SmallInteger16":
            $result = array(next_uint(2));
            break;
        case "Float":
            $result = array(next_uint(4), next_uint(4));
            break;
        case "String":
            $result = array(next_string(next_uint(4)));
            break;
        case "Symbol":
            $result = array(next_string(next_uint(4)));
            break;
        case "ByteArray":
            $result = array(next_length(next_uint(4)));
            break;
        /*case "SoundBuffer":
            $size = next_uint(4);
            $result = array();
            for ($i = 1; $i <= $size; $i++)
            {
                array_push($result, read_field());
            }
            $result = array("SoundBuffer", $result, false, false);
            break;*/
        case "UTF8":
            $result = array(next_string(next_uint(4)));
            break;
        case "Array":
            $size = next_uint(4);
            $result = array();
            for ($i = 1; $i <= $size; $i++)
            {
                array_push($result, read_field());
            }
            break;
        case "OrderedCollection":
            $size = next_uint(4);
            $result = array();
            for ($i = 1; $i <= $size; $i++)
            {
                array_push($result, read_field());
            }
            break;
        case "Dictionary":
            $size = next_uint(4);
            $result = array();
            for ($i = 1; $i <= $size; $i++)
            {
                $key = read_field();
                $value = read_field();
                array_push($result, $key, $value);
            }
            break;
        case "Color":
            $result = array(next_uint(4));
            break;
        case "TranslucentColor":
            $result = array(next_uint(4), next_byte());
            break;
        case "Point":
            $result = array(read_field(), read_field());
            break;
        case "Rectangle":
            $result = array(read_field(), read_field(), read_field(), read_field());
            break;
        case "Form":
            $width = read_field();
            $height = read_field();
            $depth = read_field();
            $offset = read_field();
            $bits = read_field();
            $result = array($width, $height, $depth, $offset, $bits);
            break;
        case "ColorForm":
            $width = read_field();
            $height = read_field();
            $depth = read_field();
            $offset = read_field();
            $bits = read_field();
            $colors = read_field();
            $result = array($width, $height, $depth, $offset, $bits, $colors);
            break;
        default:
            if($class_ID >= 100 && $class_ID <= 174)
            {
                $version = next_byte();
                $size = next_byte();
                $result = array();
                for ($i = 1; $i <= $size; $i++)
                {
                    $value = read_field();
                    array_push($result, $value);
                }
                return array($class_name, $result, true, false);
            }
            else
            {
                die("Unknown classID: " . $class_ID . "<br/>");
            }
    }
    return array($class_name, $result, false, false);
}

function fix_object($object_num)
{
    global $object;
    print_r($object);
    $class_name = $object[$object_num][0];
    if($object[$object_num][3])
    {
        return $object[$object_num];
    }
    switch ($class_name)
    {
        case "Array":
            $result = array();
            for ($i = 0; $i < count($object[$object_num][1]); $i++)
            {
                $value = object_from($object[$object_num][1][$i]);
                array_push($result, $value);
            }
            break;
        case "OrderedCollection":
            $result = array();
            for ($i = 0; $i < count($object[$object_num][1]); $i++)
            {
                $value = object_from($object[$object_num][1][$i]);
                array_push($result, $value);
            }
            break;
        case "Dictionary":
            $result = array();
            for ($i = 0; $i < count($object[$object_num][1]); $i++)
            {
                $value = object_from($object[$object_num][1][$i]);
                array_push($result, $value);
            }
            break;
        case "Form":
            $width = object_from($object[$object_num][1][0]);
            $height = object_from($object[$object_num][1][1]);
            $depth = object_from($object[$object_num][1][2]);
            $offset = object_from($object[$object_num][1][3]);
            $bits = object_from($object[$object_num][1][4]);
            $result = array($width, $height, $depth, $offset, $bits);
            break;
        case "ColorForm":
            $width = object_from($object[$object_num][1][0]);
            $height = object_from($object[$object_num][1][1]);
            $depth = object_from($object[$object_num][1][2]);
            $offset = object_from($object[$object_num][1][3]);
            $bits = object_from($object[$object_num][1][4]);
            $colors = object_from($object[$object_num][1][5]);
            $result = array($width, $height, $depth, $offset, $bits, $colors);
            break;
        default:
            if($object[$object_num][2])
            {
                $result = array();
                for ($i = 0; $i < count($object[$object_num][1]); $i++)
                {
                    $value = object_from($object[$object_num][1][$i]);
                    array_push($result, $value);
                    //print_r($object[$object_num][1][$i] = $value);
                }
                $result = array($object[$object_num][0], $result);
            }
            else
            {
                $result = $object[$object_num];
            }
    }
    $object[$object_num][3] = true;
    print_r($object);
    exit;
    //print_object($result);
    return array($class_name, $result, $object[$object_num][2], true);
}

function object_from($object_ref)
{
    global $object;
    if ($object_ref[0] != "ObjectRef")
    {
        return $object_ref;
    }
    $temp = fix_object($object_ref[1][0] - 1);
    $object[$object_ref[1][0] - 1] = $temp;
    return $temp;
}

function print_objects($objects)
{
    for ($i = 0; $i < count($objects); $i++)
    {
        echo "[" . $i . "] => " . $objects[$i][0] . "(";
        foreach ($objects[$i][1] as $item) {
            echo $item[0];
            if($item[0] == "ObjectRef")
            {
                echo "(" . $item[1][0] . ")";
            }
            echo ", ";
        }
        echo ")<br/>";
    }
}
?>
