import os


def get_env_variable(variable_name, default_value=""):
    return os.environ.get(variable_name, default_value)


def parse_comma_set_str_to_list(comma_sep_str):
    if not comma_sep_str or not isinstance(comma_sep_str, str):
        return []
    return [string.strip() for string in comma_sep_str.split(",") if string]


if __name__ == "__main__":
    print(parse_comma_set_str_to_list(None))
    print(parse_comma_set_str_to_list(""))
    print(parse_comma_set_str_to_list(12312312))
    print(parse_comma_set_str_to_list("a,c,b,a,a,a"))
    print(parse_comma_set_str_to_list("a, v, a, c"))
